{
    init: function(elevators, floors) {
        for (var e=0; e<elevators.length; e++){
            var elevator = elevators[e];
            setElevatorHandlers(elevator);
        }

        function setElevatorHandlers(elevator){
            elevator.on("idle", function() {
                setElevatorSignals(elevator);
                //if not at top go one up
                if (elevator.currentFloor() < floors.length-1){
                    elevator.goToFloor(elevator.currentFloor() + 1);
                }
                //if at top go to 0
                else {
                    elevator.goToFloor(0);
                }
                    
                });

            elevator.on("floor_button_pressed", function(floorNum){
                console.log("Pressed floors: ",elevator.getPressedFloors());
                console.log("Destination Queue: ",elevator.destinationQueue);
                setElevatorSignals(elevator);
                elevator.goToFloor(floorNum);
                optimizeOrder(elevator);
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
            var pressed = elevator.getPressedFloors();
            var temp = elevator.getPressedFloors();
            var passed=elevator.destinationQueue;
            var index = 0;
            //up - permutes the queue to be in ascending order starting at current floor
            if (elevator.goingUpIndicator() && !elevator.goingDownIndicator()){
                for (var i; i<pressed.length; i++){
                    if (pressed[i] >= elevator.currentFloor()){
                        index = i;
                        break;
                    }
                }
            pressed.splice(0,i);
            temp.splice(i,temp.length);
            pressed.concat(temp);
            elevator.destinationQueue = pressed;
            console.log("Optimized UP: ", elevator.destinationQueue);
            }

        //down - permutes the queue to be in descending order starting at current floor
        if (elevator.goingDownIndicator() && !elevator.goingUpIndicator()){
                for (var i; i<pressed.length; i++){
                    if (pressed[i] <= elevator.currentFloor()){
                        index = i-1;
                        break;
                    }
                }
            pressed.splice(0,i);
            temp.splice(i,temp.length);
            var reverse=[];
            for (var j = pressed.length; j>pressed.length; j--){
                reverse.append(pressed[j]);
            }
            reverse.concat(temp);
            elevator.destinationQueue = reverse;
            // pressed.concat(temp);
            // elevator.destinationQueue = pressed;
            console.log("Optimized Down: ", elevator.destinationQueue);
        }
     }

},

    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    }
}