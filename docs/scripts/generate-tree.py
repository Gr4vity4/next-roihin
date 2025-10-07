import os
import pathlib
import re
import collections

REPO_ROOT = pathlib.Path('.').resolve()
IMPORT_PATTERN = r"from [\"']([^\"']+)[\"']"
FILE_EXTENSIONS = [".tsx", ".ts", ".jsx", ".js", ".mjs", ".css"]
INDEX_FILES = ["index.tsx", "index.ts", "index.jsx", "index.js", "index.mjs"]


def resolve_import(base_dir: pathlib.Path, specifier: str) -> pathlib.Path | None:
    """Resolve an import specifier to a project-relative path."""
    if specifier.startswith('@/'):
        candidate = pathlib.Path('src') / specifier[2:]
    elif specifier.startswith(('./', '../')):
        candidate = (base_dir / specifier).resolve()
        try:
            candidate = candidate.relative_to(REPO_ROOT)
        except ValueError:
            return None
    else:
        return None

    if candidate.exists():
        if candidate.is_file():
            return candidate
        if candidate.is_dir():
            for filename in INDEX_FILES:
                index_path = candidate / filename
                if index_path.exists():
                    return index_path
            return candidate

    # Try implicit extensions
    candidate_str = candidate.as_posix()
    for ext in FILE_EXTENSIONS:
        ext_path = pathlib.Path(candidate_str + ext)
        if ext_path.exists():
            return ext_path

    if not candidate.suffix:
        for ext in FILE_EXTENSIONS:
            ext_path = candidate.with_suffix(ext)
            if ext_path.exists():
                return ext_path

    return None


def build_dependency_graph(root_file: pathlib.Path) -> dict[str, list[str]]:
    """Build a dependency graph starting from the given file."""
    queue = collections.deque([root_file])
    graph: dict[str, list[str]] = {}
    visited: set[str] = set()

    while queue:
        current = queue.popleft()
        current_posix = current.as_posix()
        if current_posix in visited:
            continue
        visited.add(current_posix)

        if not current.exists() or current.is_dir():
            graph.setdefault(current_posix, [])
            continue

        try:
            contents = current.read_text()
        except UnicodeDecodeError:
            graph.setdefault(current_posix, [])
            continue

        imports = re.findall(IMPORT_PATTERN, contents)
        dependencies: set[str] = set()

        for spec in imports:
            resolved = resolve_import(current.parent, spec)
            if resolved and resolved.exists():
                dep_posix = resolved.as_posix()
                dependencies.add(dep_posix)
                if resolved.suffix.lower() in {'.ts', '.tsx', '.js', '.jsx', '.mjs'}:
                    queue.append(resolved)

        graph[current_posix] = sorted(dependencies)

    return graph


def print_tree(graph: dict[str, list[str]], root: str, max_depth: int) -> None:
    """Pretty-print the dependency tree up to ``max_depth``."""

    def walk(node: str, prefix: str, depth: int, ancestors: set[str]) -> None:
        if depth >= max_depth:
            return

        children = graph.get(node, [])
        for idx, child in enumerate(children):
            connector = '|- ' if idx < len(children) - 1 else '`- '
            line = prefix + connector + child
            if child in ancestors:
                print(line + ' (cycle)')
                continue

            print(line)
            next_prefix = prefix + ('|  ' if idx < len(children) - 1 else '   ')
            walk(child, next_prefix, depth + 1, ancestors | {child})

    print(root)
    walk(root, '', 0, {root})


def main() -> None:
    root_arg = os.environ.get('ROOT')
    if not root_arg:
        raise SystemExit('Set ROOT to the file you want to inspect')

    max_depth = int(os.environ.get('MAX_DEPTH', '2'))

    root_path = pathlib.Path(root_arg)
    if not root_path.exists():
        root_path = pathlib.Path('.') / root_path

    if not root_path.exists():
        raise SystemExit(f'Cannot find {root_arg}')

    graph = build_dependency_graph(root_path)
    print_tree(graph, root_path.as_posix(), max_depth)


if __name__ == '__main__':
    main()
