class ChoiceField {
    constructor() {
        this.thumbContainer = new Container();
        this.thumbRowWidth = 10;
        this.choiceFieldWidth = 18*SIZE;
        this.choiceFieldHeight = 4*SIZE;
        this.taskKeys = Array.from(taskShapeDistances.keys());
        this.rowCount = Math.ceil(this.taskKeys.length/this.thumbRowWidth);
        this.scrolledHeight = this.choiceFieldHeight*(this.rowCount/2);
    }

    initChoiceField() {
        const scrollBarWidth = 15;
        const choiceFieldX = SIZE;
        const choiceFieldY = 12*SIZE;

        var frame = new Rectangle(this.choiceFieldWidth, this.choiceFieldHeight).addTo(stage).pos(choiceFieldX/2, choiceFieldY/2);
        this.thumbContainer.addTo(stage).pos(choiceFieldX/2, choiceFieldY/2);
        this.thumbContainer.setMask(frame);

        var button = new Button({
            width:scrollBarWidth,
            height:this.choiceFieldHeight/(this.rowCount/2),
            label:"",
            borderColor:"lightGray",
            borderWidth:1.5,
		    backgroundColor:"darkGray",
            corner:scrollBarWidth*0.5
        }).expand(); // helps on mobile

        var scrollbar = new Slider({
            min:0,
            max:this.scrolledHeight-this.choiceFieldHeight,
            step:0,
            button:button,
            barLength:this.choiceFieldHeight,
            barWidth:scrollBarWidth,
            barColor:"darkGray",
            vertical:true,
            keyArrows:false,
            inside:true,
            currentValue:this.scrolledHeight-this.choiceFieldHeight
        })
            .addTo(stage)
            .pos(this.choiceFieldWidth-scrollBarWidth, choiceFieldY/2);

        scrollbar.on("change", function() {
            choiceField.thumbContainer.y = frame.y + scrollbar.currentValue - scrollbar.max;
        });

        this.fillThumbContainer();
    }

    fillThumbContainer() {
        this.thumbContainer.removeAllChildren();

        var backGround = new Rectangle(this.choiceFieldWidth, this.scrolledHeight, "lightGray").addTo(this.thumbContainer);

        var thumbStartX = 1;
        var thumbStartY = 1;

        for(var i = 0; i < this.taskKeys.length; i++) {
            var fill = (solvedTasks.has(this.taskKeys[i])) ? "darkGray" : "white"
            addThumbNail(this.taskKeys[i]+"Thumb", thumbStartX*SIZE, thumbStartY*SIZE, fill);
            thumbStartX += 1.75;
            if((i+1)%this.thumbRowWidth==0) {
                thumbStartY += 2;
                thumbStartX = 1;
            }
        }
        stage.update();
    }
}

var choiceField = new ChoiceField();