{
    init: function(elevators, floors) {
        for (var e=0; e<elevators.length; e++){
            var elevator = elevators[e];
            setElevatorHandlers(elevator);
        }

        function setElevatorHandlers(elevator){
            elevator.on("idle", function() {
                setElevatorSignals(elevator, true, true);
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
                //console.log(elevator.destinationQueue);
                //console.log("Floor logged:", floorNum);
                if (elevator.currentFloor() < elevator.destinationQueue[0]){
                    setElevatorSignals(elevator, false, true);
                }
                else{
                    setElevatorSignals(elevator, true, false);
                }
                elevator.goToFloor(floorNum);
            });
        }

        function setElevatorSignals(elevator, down, up){
            elevator.goingDownIndicator(down);
            elevator.goingUpIndicator(up);
        }

    },

    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    }
}