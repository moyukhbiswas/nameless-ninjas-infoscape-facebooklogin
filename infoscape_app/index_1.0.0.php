<!doctype html>
<?php
	session_start();
	
	if($_POST['username']) {
		$_SESSION['profileusername'] = $_POST['username'];
	}
	
	if( $_POST['useremail']) {
		$_SESSION['profileemail'] = $_POST['useremail'];
	}
	
	if(!$_SESSION['profileusername'] || !$_SESSION['profileemail']) {
		header('Location: http://localhost:8080/InfoLogin.html');
		die();
	}
?>

<html>
<head>
  <meta charset="utf-8">
  <title>React Webpack Template Title</title>
  <link rel="stylesheet" href="./mapsStyles.css">
  <script src="https://maps.googleapis.com/maps/api/js?v=3.exp&key=AIzaSyA0PGl5CPAG8CtCmeJR6vVu5gMAlA1EccQ&libraries=places,drawing"></script>
  <script src="./maps.js"></script>
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <meta name="description" content="">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
</head>
<body onload = "initialize()">
  <div id="app">APPLICATION CONTENT</div>
  <script>
	window.profileusername = "<?php echo $_SESSION['profileusername']; ?>";
	window.profileemail = "<?php echo $_SESSION['profileemail']; ?>";
  </script>
  <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css" rel="stylesheet" integrity="sha384-T8Gy5hrqNKT+hzMclPo118YTQO6cYprQmhrYwIiQ/3axmI1hQomh7Ud2hPOy8SP1" crossorigin="anonymous">
  <script>__REACT_DEVTOOLS_GLOBAL_HOOK__ = parent.__REACT_DEVTOOLS_GLOBAL_HOOK__</script>
  <script   src="https://code.jquery.com/jquery-2.2.4.min.js"   integrity="sha256-BbhdlvQf/xTY9gja0Dq3HiwQF8LaCRTXxZKRutelT44="   crossorigin="anonymous"></script>  <!-- Latest compiled and minified CSS -->
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">

  <!-- Optional theme -->
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap-theme.min.css" integrity="sha384-fLW2N01lMqjakBkx3l/M9EahuwpSfeNvV63J5ezn3uZzapT0u7EYsXMjQV+0En5r" crossorigin="anonymous">

  <!-- Latest compiled and minified JavaScript -->
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js" integrity="sha384-0mSbJDEHialfmuBBQP6A4Qrprq5OVfW37PRR3j5ELqxss1yVqOtnepnHVP9aJ7xS" crossorigin="anonymous"></script>
  <script type="text/javascript" src="./assets/app.js"></script>



  <input id="pac-input" class="controls" type="text" placeholder="Search Box">
  <input id="origin-input" class="controls" type="text"
      placeholder="Enter an origin location">

  <input id="destination-input" class="controls" type="text"
      placeholder="Enter a destination location">

  <div id="mode-selector" class="controls">
    <input type="radio" name="type" id="changemode-walking" checked="checked">
    <label for="changemode-walking">Walking</label>

    <input type="radio" name="type" id="changemode-transit">
    <label for="changemode-transit">Transit</label>

    <input type="radio" name="type" id="changemode-driving">
    <label for="changemode-driving">Driving</label>
  </div>
  
  <div id="map-canvas"></div>
</body>


</html>
