<?php
/**
 * Admin Sample Data Page
 *
 * Provides UI for installing and managing sample crystal data
 *
 * @package Roihin_Crystal_Manager
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Register admin menu
 */
add_action('admin_menu', 'roihin_crystal_add_sample_data_menu');

function roihin_crystal_add_sample_data_menu() {
    add_submenu_page(
        'edit.php?post_type=crystal',
        __('Sample Data', 'roihin-crystal'),
        __('Sample Data', 'roihin-crystal'),
        'manage_options',
        'crystal-sample-data',
        'roihin_crystal_sample_data_page'
    );
}

/**
 * Sample data admin page
 */
function roihin_crystal_sample_data_page() {
    // Check permissions
    if (!current_user_can('manage_options')) {
        wp_die(__('You do not have sufficient permissions to access this page.', 'roihin-crystal'));
    }

    $is_installed = Roihin_Crystal_Sample_Data_Installer::is_installed();
    $installed_count = Roihin_Crystal_Sample_Data_Installer::get_installed_count();
    ?>
    <div class="wrap">
        <h1><?php echo esc_html(get_admin_page_title()); ?></h1>

        <div class="notice notice-info">
            <p>
                <strong><?php _e('About Sample Data:', 'roihin-crystal'); ?></strong>
                <?php _e('Import pre-configured sample crystal products to explore all plugin features and test the frontend catalog pages.', 'roihin-crystal'); ?>
            </p>
            <p>
                <?php _e('Sample data includes 19 diverse crystals covering all 12 colors, 5 energy properties, 12 zodiac signs, and 4 elements.', 'roihin-crystal'); ?>
            </p>
        </div>

        <!-- Messages container -->
        <div id="sample-data-message" style="display: none;"></div>

        <!-- Status Box -->
        <div class="card" style="max-width: 600px; margin: 20px 0;">
            <h2><?php _e('Installation Status', 'roihin-crystal'); ?></h2>
            <table class="widefat" style="margin-top: 10px;">
                <tbody>
                    <tr>
                        <td style="width: 200px;"><strong><?php _e('Status:', 'roihin-crystal'); ?></strong></td>
                        <td id="installation-status">
                            <?php if ($is_installed): ?>
                                <span class="dashicons dashicons-yes-alt" style="color: #46b450;"></span>
                                <span style="color: #46b450;"><?php _e('Installed', 'roihin-crystal'); ?></span>
                            <?php else: ?>
                                <span class="dashicons dashicons-dismiss" style="color: #dc3232;"></span>
                                <span style="color: #dc3232;"><?php _e('Not Installed', 'roihin-crystal'); ?></span>
                            <?php endif; ?>
                        </td>
                    </tr>
                    <tr>
                        <td><strong><?php _e('Crystal Products:', 'roihin-crystal'); ?></strong></td>
                        <td id="installation-count">
                            <?php echo esc_html($installed_count); ?>
                            <?php if ($installed_count > 0): ?>
                                <a href="<?php echo admin_url('edit.php?post_type=crystal&crystal_category=sample-data'); ?>" class="button button-small" style="margin-left: 10px;">
                                    <?php _e('View All', 'roihin-crystal'); ?>
                                </a>
                            <?php endif; ?>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Actions -->
        <div class="card" style="max-width: 600px;">
            <h2><?php _e('Actions', 'roihin-crystal'); ?></h2>

            <?php if (!$is_installed): ?>
                <p>
                    <button type="button" id="install-sample-data" class="button button-primary button-hero">
                        <span class="dashicons dashicons-download" style="margin-top: 4px;"></span>
                        <?php _e('Install Sample Data', 'roihin-crystal'); ?>
                    </button>
                </p>
                <p class="description">
                    <?php _e('This will create 19 sample crystal products with images, descriptions, and full metadata.', 'roihin-crystal'); ?>
                </p>
            <?php else: ?>
                <p>
                    <button type="button" id="uninstall-sample-data" class="button button-secondary">
                        <span class="dashicons dashicons-trash" style="margin-top: 4px;"></span>
                        <?php _e('Remove Sample Data', 'roihin-crystal'); ?>
                    </button>
                </p>
                <p class="description" style="color: #d63638;">
                    <?php _e('Warning: This will permanently delete all sample crystal products and their images.', 'roihin-crystal'); ?>
                </p>
            <?php endif; ?>

            <!-- Progress bar -->
            <div id="progress-container" style="display: none; margin-top: 20px;">
                <p><strong id="progress-text"><?php _e('Processing...', 'roihin-crystal'); ?></strong></p>
                <div style="background: #f0f0f1; border-radius: 3px; height: 30px; overflow: hidden;">
                    <div id="progress-bar" style="background: #2271b1; height: 100%; width: 0%; transition: width 0.3s;"></div>
                </div>
            </div>
        </div>

        <!-- Sample Data Preview -->
        <div class="card" style="margin-top: 20px;">
            <h2><?php _e('Sample Data Preview', 'roihin-crystal'); ?></h2>
            <p><?php _e('The following crystal products will be created:', 'roihin-crystal'); ?></p>

            <table class="wp-list-table widefat fixed striped">
                <thead>
                    <tr>
                        <th style="width: 30px;">#</th>
                        <th><?php _e('Crystal Name (EN)', 'roihin-crystal'); ?></th>
                        <th><?php _e('Crystal Name (TH)', 'roihin-crystal'); ?></th>
                        <th><?php _e('Colors', 'roihin-crystal'); ?></th>
                        <th><?php _e('Energy Properties', 'roihin-crystal'); ?></th>
                        <th><?php _e('Elements', 'roihin-crystal'); ?></th>
                    </tr>
                </thead>
                <tbody>
                    <?php
                    // Load sample data for preview
                    $sample_data_path = ROIHIN_CRYSTAL_PLUGIN_DIR . 'data/sample-crystals.json';
                    if (file_exists($sample_data_path)) {
                        $json_content = file_get_contents($sample_data_path);
                        $crystals = json_decode($json_content, true);

                        if (is_array($crystals)) {
                            foreach ($crystals as $index => $crystal) {
                                ?>
                                <tr>
                                    <td><?php echo esc_html($index + 1); ?></td>
                                    <td><strong><?php echo esc_html($crystal['crystal_name_en'] ?? '-'); ?></strong></td>
                                    <td><?php echo esc_html($crystal['crystal_name_th'] ?? '-'); ?></td>
                                    <td>
                                        <?php
                                        if (!empty($crystal['color_filter'])) {
                                            echo esc_html(implode(', ', array_slice($crystal['color_filter'], 0, 3)));
                                            if (count($crystal['color_filter']) > 3) {
                                                echo ' +' . (count($crystal['color_filter']) - 3);
                                            }
                                        } else {
                                            echo '-';
                                        }
                                        ?>
                                    </td>
                                    <td>
                                        <?php
                                        if (!empty($crystal['energy_properties'])) {
                                            echo esc_html(count($crystal['energy_properties'])) . ' ' . __('properties', 'roihin-crystal');
                                        } else {
                                            echo '-';
                                        }
                                        ?>
                                    </td>
                                    <td>
                                        <?php
                                        if (!empty($crystal['element_type'])) {
                                            echo esc_html(implode(', ', $crystal['element_type']));
                                        } else {
                                            echo '-';
                                        }
                                        ?>
                                    </td>
                                </tr>
                                <?php
                            }
                        }
                    }
                    ?>
                </tbody>
            </table>
        </div>

        <!-- Help Box -->
        <div class="card" style="margin-top: 20px; max-width: 800px; background: #f8f9fa;">
            <h2><?php _e('Help & Information', 'roihin-crystal'); ?></h2>
            <ul style="list-style: disc; padding-left: 20px;">
                <li><strong><?php _e('Safe to Install:', 'roihin-crystal'); ?></strong> <?php _e('Sample data is tagged with a special category for easy identification and removal.', 'roihin-crystal'); ?></li>
                <li><strong><?php _e('Complete Data:', 'roihin-crystal'); ?></strong> <?php _e('Each crystal includes bilingual names, descriptions, properties, filters, and images from Unsplash.', 'roihin-crystal'); ?></li>
                <li><strong><?php _e('Filter Coverage:', 'roihin-crystal'); ?></strong> <?php _e('Sample data covers all filter options to test the frontend catalog pages.', 'roihin-crystal'); ?></li>
                <li><strong><?php _e('Images:', 'roihin-crystal'); ?></strong> <?php _e('Crystal images will be downloaded from Unsplash and added to your media library.', 'roihin-crystal'); ?></li>
                <li><strong><?php _e('Related Products:', 'roihin-crystal'); ?></strong> <?php _e('No related products are set - you can add them manually if needed.', 'roihin-crystal'); ?></li>
                <li><strong><?php _e('Clean Removal:', 'roihin-crystal'); ?></strong> <?php _e('Uninstalling removes all sample posts and images without affecting your real data.', 'roihin-crystal'); ?></li>
            </ul>
        </div>
    </div>

    <script type="text/javascript">
    jQuery(document).ready(function($) {
        var nonce = '<?php echo wp_create_nonce('roihin_crystal_sample_data'); ?>';

        // Show message
        function showMessage(message, type) {
            var $messageDiv = $('#sample-data-message');
            $messageDiv.removeClass('notice-success notice-error notice-warning notice-info');
            $messageDiv.addClass('notice is-dismissible notice-' + type);
            $messageDiv.html('<p>' + message + '</p>');
            $messageDiv.show();

            // Scroll to message
            $('html, body').animate({
                scrollTop: $messageDiv.offset().top - 50
            }, 500);
        }

        // Show progress
        function showProgress(text, percent) {
            $('#progress-container').show();
            $('#progress-text').text(text);
            $('#progress-bar').css('width', percent + '%');
        }

        // Hide progress
        function hideProgress() {
            $('#progress-container').hide();
            $('#progress-bar').css('width', '0%');
        }

        // Update status display
        function updateStatus(installed, count) {
            var $status = $('#installation-status');
            var $count = $('#installation-count');

            if (installed) {
                $status.html('<span class="dashicons dashicons-yes-alt" style="color: #46b450;"></span>' +
                    '<span style="color: #46b450;"><?php _e('Installed', 'roihin-crystal'); ?></span>');
                $count.html(count + ' <a href="<?php echo admin_url('edit.php?post_type=crystal&crystal_category=sample-data'); ?>" class="button button-small" style="margin-left: 10px;"><?php _e('View All', 'roihin-crystal'); ?></a>');

                // Switch buttons
                $('#install-sample-data').parent().parent().hide();
                $('#uninstall-sample-data').parent().parent().show();
            } else {
                $status.html('<span class="dashicons dashicons-dismiss" style="color: #dc3232;"></span>' +
                    '<span style="color: #dc3232;"><?php _e('Not Installed', 'roihin-crystal'); ?></span>');
                $count.text('0');

                // Switch buttons
                $('#install-sample-data').parent().parent().show();
                $('#uninstall-sample-data').parent().parent().hide();
            }
        }

        // Install sample data
        $('#install-sample-data').on('click', function() {
            if (!confirm('<?php _e('Are you sure you want to install sample data? This will create 19 crystal products.', 'roihin-crystal'); ?>')) {
                return;
            }

            var $button = $(this);
            $button.prop('disabled', true);

            showProgress('<?php _e('Installing sample data...', 'roihin-crystal'); ?>', 10);

            $.ajax({
                url: ajaxurl,
                type: 'POST',
                data: {
                    action: 'roihin_crystal_install_sample_data',
                    nonce: nonce
                },
                success: function(response) {
                    hideProgress();
                    $button.prop('disabled', false);

                    if (response.success) {
                        showMessage(response.data.message, 'success');
                        updateStatus(true, response.data.count);
                    } else {
                        showMessage(response.data.message, 'error');
                    }
                },
                error: function() {
                    hideProgress();
                    $button.prop('disabled', false);
                    showMessage('<?php _e('An error occurred. Please try again.', 'roihin-crystal'); ?>', 'error');
                }
            });
        });

        // Uninstall sample data
        $('#uninstall-sample-data').on('click', function() {
            if (!confirm('<?php _e('Are you sure you want to remove all sample data? This action cannot be undone.', 'roihin-crystal'); ?>')) {
                return;
            }

            var $button = $(this);
            $button.prop('disabled', true);

            showProgress('<?php _e('Removing sample data...', 'roihin-crystal'); ?>', 10);

            $.ajax({
                url: ajaxurl,
                type: 'POST',
                data: {
                    action: 'roihin_crystal_uninstall_sample_data',
                    nonce: nonce
                },
                success: function(response) {
                    hideProgress();
                    $button.prop('disabled', false);

                    if (response.success) {
                        showMessage(response.data.message, 'success');
                        updateStatus(false, 0);
                    } else {
                        showMessage(response.data.message, 'error');
                    }
                },
                error: function() {
                    hideProgress();
                    $button.prop('disabled', false);
                    showMessage('<?php _e('An error occurred. Please try again.', 'roihin-crystal'); ?>', 'error');
                }
            });
        });
    });
    </script>
    <?php
}
