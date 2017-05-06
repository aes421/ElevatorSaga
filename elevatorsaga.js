{
    init: function(elevators, floors) {
        var waitingQueue = [];
        for (var e=0; e<elevators.length; e++){ //
            var elevator = elevators[e];
            setElevatorHandlers(elevator);
        }
        for (var f=0; f<floors.length; f++){
            var floor = floors[f];
            setFloorHandlers(floor);
        }

        function setFloorHandlers(floor){
            floor.on("up_button_pressed", function() {
                //console.log("up_button_pressed BEFORE: ", waitingQueue, " length: ", waitingQueue.length);
                if (!waitingQueue.includes(floor.level)){
                    waitingQueue.push(floor.level);
                }

                //console.log("up_button_pressed AFTER: ", waitingQueue, " length: ", waitingQueue.length);
        })
            floor.on("down_button_pressed", function() {
                //console.log("down_button_pressed BEFORE: ", waitingQueue, " length: ", waitingQueue.length)
                if (!waitingQueue.includes(floor.level)){
                    waitingQueue.push(floor.level);
                }
                //console.log("down_button_pressed AFTER: ", waitingQueue, " length: ", waitingQueue.length);
        })
        }

        function setElevatorHandlers(elevator){
            elevator.on("idle", function() {
                //if not at top go one up;
                console.log("idle: ");//, waitingQueue, " length: ", waitingQueue.length);
                if (waitingQueue.length > 0){
                    elevator.goToFloor(waitingQueue[0]);
                }
                else{
                    var assignedFloor = elevators.indexOf(elevator);
                    elevator.goToFloor(assignedFloor);
                    //elevator.goToFloor(Math.floor(floors.length/2));
                }
                setElevatorSignals(elevator);
                });

            elevator.on("floor_button_pressed", function(floorNum){
                //console.log("floor_button_pressed");
                elevator.goToFloor(floorNum);

                optimizeOrder(elevator);
                setElevatorSignals(elevator);
            });

            elevator.on("stopped_at_floor", function(floorNum) {
                if (waitingQueue.includes(floorNum)){
                    //console.log("This floor is in our waitingQueue!!", waitingQueue);
                    var index = waitingQueue.indexOf(floorNum);
                    //console.log("INDEX YO:", index);
                    waitingQueue.splice(index, 1);
                    //console.log("EXTERMINATE!!", waitingQueue);
                }

                optimizeOrder(elevator);
                setElevatorSignals(elevator);
            });

            elevator.on("passing_floor", function(floorNum, direction) {
                //if there's people waiting and the elevator is less than half full
                if(waitingQueue.includes(floorNum) && elevator.loadFactor()<=0.5){
                    //person also needs to be going same direction
                    if ((elevator.goingDownIndicator() && direction == "up") || elevator.goingDownIndicator() && direction == "down"){
                        //stop and pick them up
                        elevator.goToFloor(floorNum);
                        optimizeOrder(elevator);
                    }

                }
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
            //need to optimize destination queue not pressed floors
             if (elevator.goingUpIndicator() && !elevator.goingDownIndicator()){
                elevator.destinationQueue = elevator.destinationQueue.sort()//elevator.getPressedFloors();
                elevator.checkDestinationQueue();
            }
            if (elevator.goingDownIndicator() && !elevator.goingUpIndicator()){
                elevator.destinationQueue = elevator.destinationQueue.sort().reverse()//elevator.getPressedFloors().reverse();
                elevator.checkDestinationQueue();  
            }
      }

},

    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    }
}