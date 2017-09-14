(function($) {
    $.tabSelect = function(element, options) {
        var plugin = this;
        var defaults = {
            elementContainer: 'div',
            activeClass: 'active',
            elementClasses: '',
			elementType: 'span',
			tabElements: [],
			selectedTabs: [],
			multipleSelections: true,
			onChange: function() {}
        }

        plugin.element = element;
        plugin.element_jq = $(element);
        plugin.element_jq.hide();

        plugin.settings = $.extend({}, defaults, options);
        plugin.container_jq = $(document.createElement(plugin.settings.elementContainer));

        plugin.init = function() {
			if (plugin.settings.selectedTabs === 'all'){
                $.each(plugin.settings.tabElements, function(index, elem) {
                    plugin.settings.selectedTabs.push(elem.value);
                });
			}

            plugin.initSelected();

            plugin.container_jq.addClass('tagselect-container');
            plugin.element_jq.after(plugin.container_jq);

            $.each(plugin.settings.tabElements, function(index, elem){
				var $tab = $(document.createElement(plugin.settings.elementType));
                $tab.addClass(plugin.settings.elementClasses).attr('data-value', elem.value).html(elem.text);

                // Add additional content to the tab, if specified
                if(elem.disabled) {
                    $tab.addClass('tagselect-disabled');
                }
                if(elem.selected) {
                    $tab.addClass('tagselect-selected');
                }
                if(elem.classes) {
                    $tab.addClass(elem.classes);
                }
                if(elem.icon) {
                    $tab.append($(document.createElement('i')).addClass(elem.icon));
                }
                if(elem.subtext) {
                    $tab.append($(document.createElement('span')).html(elem.subtext));
                }

                if (plugin.settings.selectedTabs.indexOf(elem.value) !== -1){
					$tab.addClass(plugin.settings.activeClass);
				}

                $tab.click(function(){
					if ($(this).hasClass(plugin.settings.activeClass)){
						$(this).removeClass(plugin.settings.activeClass);
					} else {
						$(this).addClass(plugin.settings.activeClass);
					}
					plugin.onChange();
				});
				plugin.container_jq.append($tab);
			});

            plugin.registerObservers();
        }

        plugin.initSelected = function() {
            if (plugin.element_jq.is("select")){
                plugin.settings.selectedTabs = plugin.element_jq.val();
            } else {
                plugin.settings.selectedTabs = plugin.element_jq.val().split(',');
            }
        }

        plugin.registerObservers = function() {
            plugin.element_jq.bind('tagselect:updated', function() {
                plugin.initSelected();
                plugin.container_jq.find(plugin.settings.elementType).removeClass(plugin.settings.activeClass).each(function(){
    				if (plugin.settings.selectedTabs.indexOf(''+$(this).data('value')) !== -1) {
    					$(this).addClass(plugin.settings.activeClass);
    				}
    			});
            });
        }

        plugin.onChange = function(){
            plugin.element_jq.val(plugin.getAllSelected());
			plugin.settings.onChange(plugin.getAllSelected());
        }

		plugin.getAllSelected = function() {
			var values = [];
			plugin.container_jq.find(plugin.settings.elementType).each(function(){
				if ($(this).hasClass(plugin.settings.activeClass)){
					values.push($(this).data('value'));
				}
			});
			return values;
        }

		plugin.selectAll = function() {
			var cnt = 0;
			plugin.container_jq.find(plugin.settings.elementType).each(function(){
				if (!$(this).hasClass(plugin.settings.activeClass)){
					$(this).addClass(plugin.settings.activeClass);
					cnt++;
				}
			});
			if (cnt > 0){
				plugin.onChange();
			}
        }

		plugin.deselectAll = function() {
			var cnt = 0;
			plugin.container_jq.find(plugin.settings.elementType).each(function(){
				if ($(this).hasClass(plugin.settings.activeClass)){
					$(this).removeClass(plugin.settings.activeClass);
					cnt++;
				}
			});
			if (cnt > 0){
				plugin.onChange();
			}
        }

        plugin.init();
    }

    $.fn.tabSelect = function(options) {
        return this.each(function() {
            if (undefined === $(this).data('tabSelect')) {
                var plugin = new $.tabSelect(this, options);
                $(this).data('tabSelect', plugin);
            }
        });
    }
})(jQuery);

if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function(obj, start) {
	    for (var i = (start || 0), j = this.length; i < j; i++) {
	        if (this[i] === obj) {
                return i;
            }
	    }
	    return -1;
	}
}
