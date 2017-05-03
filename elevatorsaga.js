{
    init: function(elevators, floors) {
        for (var e=0; e<elevators.length; e++){
            console.log(e);
            var elevator = elevators[e];
            setElevatorHandlers(elevator);
        }

        function setElevatorHandlers(elevator){
            elevator.on("idle", function() {
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
                elevator.goToFloor(floorNum);
            });
        }

    },

    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    }
}