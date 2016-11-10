var CusCropImage = function (options) {
    var el = document.querySelector(options.imageBox),
            obj =
            {
                state: {},
                ratio: 1,
                options: options,
                imageBox: el,
                croppingBox: el.querySelector(options.croppingBox),
                spinner: el.querySelector(options.spinner),
                image: new Image(),
                getDataURL: function ()
                {
                    var width = this.croppingBox.clientWidth,
                            height = this.croppingBox.clientHeight,
                            canvas = document.createElement("canvas"),
                            dim = el.style.backgroundPosition.split(' '),
                            size = el.style.backgroundSize.split(' '),
                            dx = parseInt(dim[0]) - el.clientWidth / 2 + width / 2,
                            dy = parseInt(dim[1]) - el.clientHeight / 2 + height / 2,
                            dw = parseInt(size[0]),
                            dh = parseInt(size[1]),
                            sh = parseInt(this.image.height),
                            sw = parseInt(this.image.width);

                    canvas.width = width;
                    canvas.height = height;
                    var context = canvas.getContext("2d");
                    context.drawImage(this.image, 0, 0, sw, sh, dx, dy, dw, dh);
                    var imageData = canvas.toDataURL('image/png');
                    return imageData;
                },
                getBlob: function ()
                {
                    var imageData = this.getDataURL();
                    var b64 = imageData.replace('data:image/png;base64,', '');
                    var binary = atob(b64);
                    var array = [];
                    for (var i = 0; i < binary.length; i++) {
                        array.push(binary.charCodeAt(i));
                    }
                    return  new Blob([new Uint8Array(array)], {type: 'image/png'});
                },
                zoomIn: function ()
                {
                    this.ratio *= 1.1;
                    setBackground();
                },
                zoomOut: function ()
                {
                    this.ratio *= 0.9;
                    setBackground();
                },
                zoomreset: function ()
                {
                    this.ratio = 1;
                    setBackground();
                },
                enableControls: function ()
                {
                    $("#cropping_btn,#zoom_in_btn,#zoom_out_btn,#zoom_reset_btn").prop("disabled", false);
                    obj.state = {};
                    this.ratio = 1;
                    setBackground();
                    stopEvent(window.event);
                }
            },
    attachEvent = function (node, event, cb)
    {
        if (node.attachEvent)
            node.attachEvent('on' + event, cb);
        else if (node.addEventListener)
            node.addEventListener(event, cb);
    },
            detachEvent = function (node, event, cb)
            {
                if (node.detachEvent) {
                    node.detachEvent('on' + event, cb);
                }
                else if (node.removeEventListener) {
                    node.removeEventListener(event, render);
                }
            },
            stopEvent = function (e) {
                e.defaultPrevented = true;
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                e.cancelBubble = true;
            },
            setBackground = function ()
            {
                var w = parseInt(obj.image.width) * obj.ratio;
                var h = parseInt(obj.image.height) * obj.ratio;

                var pw = (el.clientWidth - w) / 2;
                var ph = (el.clientHeight - h) / 2;

                el.setAttribute('style',
                        'background-image: url(' + obj.image.src + '); ' +
                        'background-size: ' + w + 'px ' + h + 'px; ' +
                        'background-position: ' + pw + 'px ' + ph + 'px; ' +
                        'background-repeat: no-repeat');
            },
            imgMouseDown = function (e)
            {
                stopEvent(e);

                obj.state.dragable = true;
                obj.state.mouseX = e.clientX;
                obj.state.mouseY = e.clientY;
                attachEvent(el, 'mousemove', imgMouseMove);
            },
            imgMouseMove = function (e)
            {
                stopEvent(e);

                if (obj.state.dragable)
                {
                    var x = e.clientX - obj.state.mouseX;
                    var y = e.clientY - obj.state.mouseY;

                    var bg = el.style.backgroundPosition.split(' ');

                    var bgX = x + parseInt(bg[0]);
                    var bgY = y + parseInt(bg[1]);

                    el.style.backgroundPosition = bgX + 'px ' + bgY + 'px';

                    obj.state.mouseX = e.clientX;
                    obj.state.mouseY = e.clientY;
//                    console.log("----");
//                    console.log(bgX + 'px ' + bgY + 'px');
                }
            },
            imgMouseUp = function (e)
            {
                stopEvent(e);
                obj.state.dragable = false;
            },
            zoomImage = function (e)
            {
                var evt = window.event || e;
                var delta = evt.detail ? evt.detail * (-120) : evt.wheelDelta;
                delta > -120 ? obj.ratio *= 1.1 : obj.ratio *= 0.9;
                setBackground();
            }

    obj.spinner.style.display = 'block';
    if ($.isArray(obj.options.cropArea))
    {
        obj.croppingBox.style.width = obj.options.cropArea[0] + "px";
        obj.croppingBox.style.height = obj.options.cropArea[1] + "px";
    }
    obj.image.onload = function () {
        obj.spinner.style.display = 'none';
        setBackground();

        attachEvent(el, 'mousedown', imgMouseDown);

        attachEvent(el, 'mouseup', imgMouseUp);
        attachEvent(document, 'mouseup', function (e) {
            stopEvent(e);
            obj.state.dragable = false;

        });
        var mousewheel = (/Firefox/i.test(navigator.userAgent)) ? 'DOMMouseScroll' : 'mousewheel';
        attachEvent(el, mousewheel, zoomImage);
    };
    obj.image.src = options.imgSrc;
    el.style.backgroundPosition = '0px 0px';
    attachEvent(el, 'DOMNodeRemoved', function () {
        detachEvent(el, 'DOMNodeRemoved', imgMouseUp)
    });

    return obj;
};
