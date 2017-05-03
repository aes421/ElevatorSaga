{
    init: function(elevators, floors) {
        var elevator = elevators[0];
        // Whenever the elevator is idle (has no more queued destinations) ...
        elevator.on("idle", function() {
            console.log("idle");
            //if not at top go one up
            if (elevator.currentFloor() < floors.length-1){
                console.log(elevator.destinationQueue);
                elevator.goToFloor(elevator.currentFloor() + 1);
            }
            //if at top go to 0
            else {
                console.log(elevator.destinationQueue);
                elevator.goToFloor(0);
            }
                
            });

            elevator.on("floor_button_pressed", function(floorNum){
                console.log("floor_button_pressed");
                console.log(elevator.destinationQueue);
                elevator.goToFloor(floorNum);
            });

    },
    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    }
}