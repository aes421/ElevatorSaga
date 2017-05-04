{
    init: function(elevators, floors) {
        var waitingQueue = [];
        for (var e=0; e<elevators.length; e++){
            var elevator = elevators[e];
            setElevatorHandlers(elevator);
        }
        for (var f=0; f<floors.length; f++){
            var floor = floors[f];
            setFloorHandlers(floor);
        }

        function setFloorHandlers(floor){
            floor.on("up_button_pressed", function() {
                if (!waitingQueue.includes(floor.level)){
                    waitingQueue.push(floor.level);
                }

                console.log("up_button_pressed: ", waitingQueue, " length: ", waitingQueue.length);
        })
            floor.on("down_button_pressed", function() {
                if (!waitingQueue.includes(floor.level)){
                    waitingQueue.push(floor.level);
                }
                console.log("down_button_pressed: ", waitingQueue, " length: ", waitingQueue.length);
        })
        }

        function setElevatorHandlers(elevator){
            elevator.on("idle", function() {
                //if not at top go one up;
                console.log("idle: ");//, waitingQueue, " length: ", waitingQueue.length);
                if (waitingQueue.length > 0){
                    elevator.goToFloor(waitingQueue[0]);
                }
                waitingQueue = waitingQueue.slice(1,waitingQueue.length);
                if (elevator.currentFloor() < floors.length-1){
                    elevator.goToFloor(elevator.currentFloor() + 1);
                }
                //if at top go to 0
                else {
                    elevator.goToFloor(0);
                }
                setElevatorSignals(elevator);
                });

            elevator.on("floor_button_pressed", function(floorNum){
                console.log("floor_button_pressed");
                elevator.goToFloor(floorNum);

                optimizeOrder(elevator);
                setElevatorSignals(elevator);
            });

            elevator.on("stopped_at_floor", function(floorNum) {
                if (waitingQueue.includes(floorNum)){
                    var temp=[];
                    for (var t=0;t<waitingQueue.length;t++){
                        if (waitingQueue[t].level != floorNum){
                            temp.push(floorNum);
                        }
                    }
                    waitingQueue = temp;
                }
                optimizeOrder(elevator);
                setElevatorSignals(elevator);
            });
        }


        function setElevatorSignals(elevator){
            if (elevator.currentFloor() < elevator.destinationQueue[0]){
                    down = false;
                    up = true;
                }
            else if (elevator.currentFloor() > elevator.destinationQueue[0]){
                down = true;
                up = false;
            }
            else{
                down = true;
                up = true;
            }
            elevator.goingDownIndicator(down);
            elevator.goingUpIndicator(up);
        }


        function optimizeOrder(elevator){
            if (elevator.goingUpIndicator() && !elevator.goingDownIndicator()){
                elevator.destinationQueue = elevator.getPressedFloors();
            }
            if (elevator.goingDownIndicator() && !elevator.goingUpIndicator()){
                elevator.destinationQueue = elevator.getPressedFloors().reverse();  
            }
      }

},

    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    }
}