/**
 * Admin Scripts for ROIHIN Personalized Designs Manager
 */

(function($) {
    'use strict';

    /**
     * Initialize when DOM is ready
     */
    $(document).ready(function() {
        initEnergyPropertiesValidation();
        initGalleryEnhancements();
        initStoneFieldEnhancements();
        initQuickEditSupport();
        initBulkActionConfirmation();
    });

    /**
     * Validate energy properties on the fly
     */
    function initEnergyPropertiesValidation() {
        // Check for duplicate categories
        $(document).on('change', '.acf-field[data-name="energy_properties"] select[data-name="category"]', function() {
            var selectedCategories = [];
            var hasDuplicate = false;

            $('.acf-field[data-name="energy_properties"] select[data-name="category"]').each(function() {
                var value = $(this).val();
                if (value && selectedCategories.includes(value)) {
                    hasDuplicate = true;
                }
                selectedCategories.push(value);
            });

            if (hasDuplicate) {
                alert('Each energy property category must be unique. Please select different categories.');
            }
        });

        // Ensure all 5 categories are present before publish
        $('form#post').on('submit', function(e) {
            var energyPropsCount = $('.acf-field[data-name="energy_properties"] .acf-row:not(.acf-clone)').length;

            if (energyPropsCount !== 5) {
                e.preventDefault();
                alert('You must add exactly 5 energy property ratings before publishing.');
                return false;
            }

            // Check for required categories
            var requiredCategories = [
                'finance_fortune',
                'work_business',
                'love_happiness',
                'health_balance',
                'spirituality'
            ];
            var selectedCategories = [];

            $('.acf-field[data-name="energy_properties"] select[data-name="category"]').each(function() {
                selectedCategories.push($(this).val());
            });

            var missingCategories = requiredCategories.filter(function(cat) {
                return !selectedCategories.includes(cat);
            });

            if (missingCategories.length > 0) {
                e.preventDefault();
                alert('All 5 energy property categories must be present.');
                return false;
            }
        });
    }

    /**
     * Gallery enhancements
     */
    function initGalleryEnhancements() {
        // Show image count
        $(document).on('change', '.acf-field[data-name="design_gallery"]', function() {
            var imageCount = $(this).find('.acf-gallery-attachment').length;
            var $countDisplay = $(this).find('.rpd-image-count');

            if ($countDisplay.length === 0) {
                $countDisplay = $('<div class="rpd-image-count" style="margin-top: 10px; font-size: 13px; color: #666;"></div>');
                $(this).find('.acf-gallery-toolbar').after($countDisplay);
            }

            $countDisplay.text('Images: ' + imageCount + ' / 10');

            if (imageCount < 1) {
                $countDisplay.css('color', '#dc2626');
            } else if (imageCount >= 10) {
                $countDisplay.css('color', '#16a34a');
            } else {
                $countDisplay.css('color', '#666');
            }
        });
    }

    /**
     * Stone field enhancements
     */
    function initStoneFieldEnhancements() {
        // Auto-capitalize stone names
        $(document).on('blur', '.acf-field[data-name="stones_used"] input[data-name="stone_name"]', function() {
            var value = $(this).val();
            if (value) {
                // Capitalize first letter of each word
                var capitalized = value.replace(/\b\w/g, function(char) {
                    return char.toUpperCase();
                });
                $(this).val(capitalized);
            }
        });

        // Show stone count
        $(document).on('change', '.acf-field[data-name="stones_used"]', function() {
            var stoneCount = $(this).find('.acf-row:not(.acf-clone)').length;
            var $countDisplay = $(this).find('.rpd-stone-count');

            if ($countDisplay.length === 0) {
                $countDisplay = $('<div class="rpd-stone-count" style="margin-top: 10px; font-size: 13px; color: #666;"></div>');
                $(this).find('.acf-actions').before($countDisplay);
            }

            $countDisplay.text('Stones: ' + stoneCount + ' / 15');

            if (stoneCount < 1) {
                $countDisplay.css('color', '#dc2626');
            } else if (stoneCount >= 15) {
                $countDisplay.css('color', '#16a34a');
            } else {
                $countDisplay.css('color', '#666');
            }
        });
    }

    /**
     * Quick edit support
     */
    function initQuickEditSupport() {
        // Populate quick edit fields
        var $wpInlineEdit = inlineEditPost.edit;

        inlineEditPost.edit = function(id) {
            $wpInlineEdit.apply(this, arguments);

            var postId = 0;
            if (typeof id === 'object') {
                postId = parseInt(this.getId(id));
            }

            if (postId > 0) {
                var $row = $('#post-' + postId);
                var budgetLevel = $row.find('.column-budget_level').text();

                $('#edit-' + postId + ' select[name="budget_level"]').val(budgetLevel);
            }
        };
    }

    /**
     * Bulk action confirmation
     */
    function initBulkActionConfirmation() {
        $('#doaction, #doaction2').on('click', function(e) {
            var action = $(this).siblings('select').val();

            if (action === 'rpd_duplicate') {
                var confirmed = confirm('Are you sure you want to duplicate the selected designs?');
                if (!confirmed) {
                    e.preventDefault();
                    return false;
                }
            }

            if (action === 'trash') {
                var $checked = $('input[name="post[]"]:checked');
                if ($checked.length > 0) {
                    var confirmed = confirm('Are you sure you want to move ' + $checked.length + ' design(s) to trash?');
                    if (!confirmed) {
                        e.preventDefault();
                        return false;
                    }
                }
            }
        });
    }

    /**
     * ACF specific enhancements
     */
    if (typeof acf !== 'undefined') {
        acf.addAction('ready', function() {
            // Trigger initial updates
            $('.acf-field[data-name="design_gallery"]').trigger('change');
            $('.acf-field[data-name="stones_used"]').trigger('change');
        });

        // Custom validation messages
        acf.addAction('validation_failure', function($form) {
            // Scroll to first error
            var $firstError = $form.find('.acf-error').first();
            if ($firstError.length) {
                $('html, body').animate({
                    scrollTop: $firstError.offset().top - 100
                }, 500);
            }
        });
    }

    /**
     * Helper: Format stone size display
     */
    function formatStoneSize(size) {
        if (size.match(/^\d+$/)) {
            return size + ' mm.';
        }
        return size;
    }

    /**
     * Helper: Get energy category label
     */
    function getEnergyCategoryLabel(category) {
        var labels = {
            'finance_fortune': 'Finance & Fortune',
            'work_business': 'Work, Business, Investment',
            'love_happiness': 'Love, Happiness, Luck',
            'health_balance': 'Health, Life Balance',
            'spirituality': 'Spirituality, Stability'
        };
        return labels[category] || category;
    }

    /**
     * Helper: Get rating label
     */
    function getRatingLabel(rating) {
        rating = parseInt(rating);
        if (rating >= 5 && rating <= 8) return 'Excellent';
        if (rating === 4) return 'Very Good';
        if (rating === 3) return 'Moderate';
        if (rating >= 1 && rating <= 2) return 'Fair';
        return 'None';
    }

})(jQuery);
