function newGame(){
  var name = $('#game_name').val();console.log(name);
  var json = {game_name: name, owner: "Bill"};
  $.post( "api/game", json)
      .done(function() {
        location.reload();
      })
      .fail(function() {
        $("#error-msg").html("Failed to register. Please enter valid information.");
      })
  }

$(".gamerow").click(function(){
  window.location = "/lobby?game="+$(this).data("id");
});
 