var position = {
    getScroll: function(o) {
        if (o) {
            var scrTop = o.scrollTop();
        } else {
            var scrTop = document.documentElement.scrollTop || document.body.scrollTop;
        }
        return scrTop;
    },
    getObj: function(o) {
        if (o) {
            return {
                width: o.outerWidth(),
                height: o.outerHeight()
            };
        }
        return {
            width: document.body.clientWidth,
            height: document.body.clientHeight
        };
    },
    getView: function() {
        return {
            width: document.documentElement.clientWidth,
            height: document.documentElement.clientHeight
        };
    },
    centerPosition: function(o) {
        var left = (position.getView().width - position.getObj(o).width) / 2,
            top = (position.getView().height - position.getObj(o).height) / 2 + position.getScroll();
        return {
            x: left,
            y: top
        };
    },
    getBg: function() {
        if (document.documentElement.clientHeight > document.body.clientHeight) {
            return position.getView()
        } else {
            return position.getObj();
        }
    }
};
export {position}