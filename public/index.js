console.log("here");

function newGame(){
  alert();
  $.post( "api/game", {"name": $('#game_name').val(), "owner": "Bill"})
      .done(function() {
        
      })
      .fail(function() {
        $("#error-msg").html("Failed to register. Please enter valid information.");
      })
    
  }
 