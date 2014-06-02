function AutoInput(cardInput, autoInput) {
    this.cardInputJqEle = cardInput;
    this.autoInputJqEle = autoInput;

    this.labelCursor = 0;

    this.LABEL_INDEX = "label-index",
    this.QUALITY_INDEX = "quality-index",
    this.CARD_ID = "card-id";

    var page = this;
    this.cardInputJqEle.keyup(function (event) {
        var key = event.which; 
        // special keys
        switch(key) {
        case 13: // enter
            page.confirmSelectedLabel();                
            return;
        case 27: // escape
            page.autoInputJqEle.hide();
            return;
        case 38: // arrow up
            page.moveUpCursor();
            return;
        case 40: // arrow down
            page.moveDownCursor();
            return;
        }
        // normal input, use the perfix as key to find card candidates
        page.autoInputJqEle.empty();
        page.autoInputJqEle.hide();

        key = page.cardInputJqEle.val();
        if (key.length >= 10) key = key.substring(0, 10);

        var list = CardsInfo.prefixMap[key];
        if (!list) return;
        if (list.length >= 10) list.splice(10, list.length-10);

        list.map(function(card) {
            // normal card infomation label
            var lbl = $("<label/>").appendTo(page.autoInputJqEle);
            lbl.attr(page.LABEL_INDEX, page.autoInputJqEle.children("label").length - 1);
            lbl.attr(page.CARD_ID, card.id);
            lbl.attr(page.QUALITY_INDEX, 5 - parseInt(card.id/10000));
            lbl.css("color", CardsInfo.qualityList[lbl.attr(page.QUALITY_INDEX)].color);
            lbl.text(card.name);
            lbl.mouseover(function() {
                page.setLabelCursor(lbl.attr(page.LABEL_INDEX));
            });
            lbl.click(function() {
                page.confirmSelectedLabel();
            });
            // additional line break element
            $("<br/>").appendTo(page.autoInputJqEle);
        });
        page.setLabelCursor(0);
        page.updatePosition();

        page.autoInputJqEle.show();
    });
}

AutoInput.prototype = {
    setLabelCursor: function(val) {
        if (this.labelCursor < this.getLabelDomEleList().length) {
            this.getSelectedLabelDomEle().className = "";
        }
        this.labelCursor = parseInt(val);
        this.getSelectedLabelDomEle().className = "selected";
    },

    moveUpCursor: function() {
        this.setLabelCursor(
            (this.labelCursor == 0) ? (this.getLabelDomEleList().length-1) : (this.labelCursor-1)
        );
    },
    moveDownCursor: function() {
        this.setLabelCursor(
            (this.labelCursor == this.getLabelDomEleList().length-1) ? 0 : (this.labelCursor+1)
        );
    },

    getLabelDomEleList: function() {
        return this.autoInputJqEle.children("label");
    },
    getSelectedLabelDomEle: function() {
        return this.getLabelDomEleList()[this.labelCursor];
    },
    confirmSelectedLabel: function() {
        this.cardInputJqEle.attr("value", this.getSelectedLabelDomEle().innerHTML);
        this.cardInputJqEle.css("color", this.getSelectedLabelDomEle().style.color);
        this.autoInputJqEle.hide();
    },
    updatePosition: function() {
        var ele = this.cardInputJqEle;
        this.autoInputJqEle.css({
            width: ele.outerWidth() + "px",
            top: ele.position().top + ele.outerHeight() + "px",
            left: ele.offset().left + "px",
        });
    },
}