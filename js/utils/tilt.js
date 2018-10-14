$.fn.tilt = function (options) {

    /**
     * Public methods
     */
    $.fn.tilt.destroy = function() {
        $(this).each(function () {
            this.destroy = true;
            $(this).css({'will-change': '', 'transform': '', 'transition': ''});
            $(this).parent().off('mousemove mouseenter mouseleave');
        });
    };

    // $.fn.tilt.reset = function() {
    //     $(this).each(function () {
    //         this.mousePositions = getMousePositions.call(this);
    //         this.settings = $(this).data('settings');
    //         mouseLeave.call(this);
    //         setTimeout(() => {
    //             this.reset = false;
    //         }, this.settings.transition);
    //     });
    // };

    /**
     * Loop every instance
     */
    return this.each(function () {
        const _this = this;
        const $this = $(this);
        const $measureEl = $this.parent(); // measure wrapper, bc. element itself transformed

        /**
         * Default settings merged with user settings
         * Can be set trough data attributes or as parameter.
         * @type {*}
         */
        this.settings = $.extend({
            maxTiltX: $this.is('[data-tilt-max]') ? $this.data('tilt-max') : 15,
            maxTiltY: $this.is('[data-tilt-max]') ? $this.data('tilt-max') : 22,
            perspective: $this.is('[data-tilt-perspective]') ? $this.data('tilt-perspective') : 600,
            easing: $this.is('[data-tilt-easing]') ? $this.data('tilt-easing') : 'ease',
            speed: $this.is('[data-tilt-speed]') ? $this.data('tilt-speed') : 100,
            transition: $this.is('[data-tilt-transition]') ? $this.data('tilt-transition') : true,
        }, options);

        delete this.destroy;


        this.init = () => {
            // Store settings
            $this.data('settings', this.settings);

            // Bind events
            bindEvents();
        };

        // Init
        this.init();








        /**
         * RequestAnimationFrame
         */
        function requestTick() {
            if (_this.ticking) return;
            requestAnimationFrame(updateTransforms);
            _this.ticking = true;
        }

        /**
         * Bind mouse movement evens on instance
         */
        function bindEvents() {
            $measureEl.on('mousemove', mouseMove);
            $measureEl.on('mouseenter', mouseEnter);
            $measureEl.on('mouseleave', mouseLeave);
        }

        /**
         * Set transition only on mouse leave and mouse enter so it doesn't influence mouse move transforms
         */
        function setTransition() {
            if (_this.timeout !== undefined) clearTimeout(_this.timeout);
            $this.css({'transition': `${_this.settings.speed}ms ${_this.settings.easing}`});
            _this.timeout = setTimeout(() => {
                $this.css({'transition': ''});
            }, _this.settings.speed);
        }

        /**
         * When user mouse enters tilt element
         */
        function mouseEnter() {
            _this.ticking = false;
            $this.css({'will-change': 'transform'});
            setTransition();

            // Trigger change event
            $this.trigger("tilt.mouseEnter");
        }

        /**
         * Return the x,y position of the mouse on the tilt element
         * @returns {{x: *, y: *}}
         */
        function getMousePositions(event) {
            if (typeof(event) === "undefined") {
                event = {
                    pageX: $measureEl.offset().left + $measureEl.outerWidth() / 2,
                    pageY: $measureEl.offset().top + $measureEl.outerHeight() / 2
                };
            }
            return {x: event.pageX, y: event.pageY};
        }

        /**
         * When user mouse moves over the tilt element
         */
        function mouseMove(event) {

            _this.mousePositions = getMousePositions(event);
            requestTick();
        }

        /**
         * When user mouse leaves tilt element
         */
        function mouseLeave() {
            setTransition();
            _this.reset = true;
            requestTick();

            // Trigger change event
            $this.trigger("tilt.mouseLeave");
        }

        /**
         * Get tilt values
         *
         * @returns {{tiltX: string, tiltY: string, percentageX: number, percentageY: number, angle: number}}
         */
        function getValues() {
            const width = $measureEl.outerWidth();
            const height = $measureEl.outerHeight();
            const {left, top} = $measureEl.offset();
            let percentageX = (_this.mousePositions.x - left) / width;
            let percentageY = (_this.mousePositions.y - top) / height;
            // move extremal values from edges to 0.1/0.9
            if (percentageX < 0.1) {
                percentageX = 0.1 * 2 - percentageX;
            }
            if (percentageX > 0.9) {
                percentageX = 0.9 * 2 - percentageX;
            }
            if (percentageY < 0.1) {
                percentageY = 0.1 * 2 - percentageY;
            }
            if (percentageY > 0.9) {
                percentageY = 0.9 * 2 - percentageY;
            }
            // x or y position inside instance / width of instance = percentage of position inside instance * the max tilt value
            const tiltX = ((percentageX - 0.5) * _this.settings.maxTiltX).toFixed(2);
            const tiltY = ((0.5 - percentageY) * _this.settings.maxTiltY).toFixed(2);
            // angle
            const angle = Math.atan2(_this.mousePositions.x - (left+width/2),- (_this.mousePositions.y - (top+height/2)) )*(180/Math.PI);
            // Return x & y tilt values
            return {tiltX, tiltY, 'percentageX': percentageX * 100, 'percentageY': percentageY * 100, angle};
        }

        /**
         * Update tilt transforms on mousemove
         */
        function updateTransforms() {
            if (_this.destroy) {
                return;
            }

            _this.transforms = getValues();

            if (_this.reset) {
                _this.reset = false;
                $this.css('transform', `perspective(${_this.settings.perspective}px) rotateX(0deg) rotateY(0deg)`);

                return;
            } else {
                $this.css('transform', `perspective(${_this.settings.perspective}px) rotateX(${_this.transforms.tiltY}deg) rotateY(${_this.transforms.tiltX}deg)`);

            }

            // Trigger change event
            $this.trigger("change", [_this.transforms]);

            _this.ticking = false;
        }

    });
};