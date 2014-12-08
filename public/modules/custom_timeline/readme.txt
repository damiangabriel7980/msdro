$.ajax({url: '/mainCalendar/events', type: 'POST'}).done(function(receivedEvents){
        $.ajax({url: '/mainCalendar/months', type: 'POST'}).done(function(receivedMonths){
            timeline(receivedEvents,receivedMonths);
        });
    });