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
            })
            floor.on("down_button_pressed", function() {
                if (!waitingQueue.includes(floor.level)){
                    waitingQueue.push(floor.level);
                }
            })
        }

        function setElevatorHandlers(elevator){
            elevator.on("idle", function() {
                //if not at top go one up;
                if (!in_another_queue(waitingQueue[0])){
                    if (waitingQueue.length > 0){
                        elevator.goToFloor(waitingQueue[0]);
                    }
                }
                else{
                    var assignedFloor = elevators.indexOf(elevator);
                    elevator.goToFloor(assignedFloor);
                }
                setElevatorSignals(elevator);
                });

            elevator.on("floor_button_pressed", function(floorNum){
                elevator.goToFloor(floorNum);
                optimizeOrder(elevator);
                setElevatorSignals(elevator);
            });

            elevator.on("stopped_at_floor", function(floorNum) {
                if (waitingQueue.includes(floorNum)){
                    var index = waitingQueue.indexOf(floorNum);
                    waitingQueue.splice(index, 1);
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
                         if (!in_another_queue(waitingQueue[0])){
                            elevator.goToFloor(floorNum);
                            optimizeOrder(elevator);
                        }
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
                elevator.destinationQueue = elevator.destinationQueue.sort();
                elevator.checkDestinationQueue();
            }
            if (elevator.goingDownIndicator() && !elevator.goingUpIndicator()){
                elevator.destinationQueue = elevator.destinationQueue.sort().reverse();
                elevator.checkDestinationQueue();  
            }
      }

      function in_another_queue(floorNum){
        for (e=0; e<elevators.length; e++){
            if (elevators[e].destinationQueue.includes(floorNum) && elevators[e].loadFactor()<=0.5){
                    return true;
            }
        }
        return false;
      }

},

    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    }
}