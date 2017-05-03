{
    init: function(elevators, floors) {
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
            // Maybe tell an elevator to go to this floor?
        })
            floor.on("down_button_pressed", function() {
        // Maybe tell an elevator to go to this floor?
        })
        }

        function setElevatorHandlers(elevator){
            elevator.on("idle", function() {
                //console.log("idle start: ", elevator.destinationQueue);
                //if not at top go one up
                elevator.goToFloor(0)
                if (elevator.currentFloor() < floors.length-1){
                    elevator.goToFloor(elevator.currentFloor() + 1);
                }
                //if at top go to 0
                else {
                    elevator.goToFloor(0);
                }
                setElevatorSignals(elevator);   
                //console.log("idle end: ", elevator.destinationQueue);
                });

            elevator.on("floor_button_pressed", function(floorNum){
                //console.log("floor_button_pressed start: ", elevator.destinationQueue);
                elevator.goToFloor(floorNum);
                //console.log("Pressed floors: ",elevator.getPressedFloors());
                //console.log("Destination Queue: ",elevator.destinationQueue);

                optimizeOrder(elevator);
                setElevatorSignals(elevator);
                //console.log("floor_button_pressed end: ", elevator.destinationQueue);
            });

            elevator.on("stopped_at_floor", function(floorNum) {
                //console.log("stopped_at_floor start: ", elevator.destinationQueue);
                optimizeOrder(elevator);
                setElevatorSignals(elevator);
                //console.log("stopped_at_floor end: ", elevator.destinationQueue);
            });
        }


        function setElevatorSignals(elevator){
            //console.log("setElevatorSignals start: ", elevator.destinationQueue);
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
            //console.log("setElevatorSignals end: ", elevator.destinationQueue);
        }

        // may be able to simplify this alot if people don't get on elevator going wrong way
        //need testing to determine their behavior
        function optimizeOrder(elevator){
            if (elevator.goingUpIndicator() && !elevator.goingDownIndicator()){
                //console.log("Optimize start: ", elevator.destinationQueue);
                elevator.destinationQueue = elevator.getPressedFloors();
                //console.log("Optimize up end: ", elevator.destinationQueue);
            }
            if (elevator.goingDownIndicator() && !elevator.goingUpIndicator()){
                //console.log("Optimize down start: ", elevator.destinationQueue);
                elevator.destinationQueue = elevator.getPressedFloors().reverse();  
                //console.log("Optimize down end: ", elevator.destinationQueue);
            }
        //     var pressed = elevator.getPressedFloors();
        //     var temp = elevator.getPressedFloors();
        //     var passed=elevator.destinationQueue;
        //     var index = 0;
        //     //up - permutes the queue to be in ascending order starting at current floor
        //     if (elevator.goingUpIndicator() && !elevator.goingDownIndicator()){
        //         for (var i; i<pressed.length; i++){
        //             if (pressed[i] >= elevator.currentFloor()){
        //                 index = i;
        //                 break;
        //             }
        //         }
        //     pressed.splice(0,i);
        //     temp.splice(i,temp.length);
        //     pressed.concat(temp);
        //     elevator.destinationQueue = pressed;
        //     //console.log("Optimized Up: ", elevator.destinationQueue);
        //     }

        // //down - permutes the queue to be in descending order starting at current floor
        // if (elevator.goingDownIndicator()){
        //         for (var i=0; i<pressed.length; i++){
        //             if (pressed[i] >= elevator.currentFloor()){
        //                 index = i-1;
        //                 break;
        //             }
        //         }
        //     pressed.splice(0,i);
        //     temp.splice(i,temp.length);
        //     var reverse=[];
        //     for (var j = pressed.length; j>pressed.length; j--){
        //         reverse.append(pressed[j]);
        //     }
        //     reverse.concat(temp);
        //     elevator.destinationQueue = reverse;
        //     //console.log("Optimized Down: ", elevator.destinationQueue);
            
        // }
      }

},

    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    }
}