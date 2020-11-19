<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8">
		<link rel="stylesheet" href="style.css">
	</head> 
	<body>
        <?php
        $score = 0;
        function remember($score) { 
            if(isset($_GET[$score])) {
                $value = htmlspecialchars($_GET[$score]);
                return $value;
            }
            else if(isset($_COOKIE[$score])){
                $value = htmlspecialchars($_COOKIE[$score]);
                return $value;
            }
            return 0;
            }
        function remember1($name) { 
            if(isset($_GET[$name])) {
                $value = htmlspecialchars($_GET[$name]);
                return $value;
            }
            else if(isset($_COOKIE[$name])){
                $value = htmlspecialchars($_COOKIE[$name]);
                return $value;
            }
            return '';
            }
        

        ?>

<div class="row">
    <div class="column">
        <label>Right Key (q): </label>
        <input type="text" id="c0" value="65">
        <br>
        <label>Left Key (d): </label>
        <input type="text" id="c1" value="68">
        <br>
        <label>Down Key (s): </label>
        <input type="text" id="c2" value="83">
        <br>
        <label>Instant Falling (space): </label>
        <input type="text" id="c3" value="32">
        <br>
        <label>Rotate Left (arrow_left): </label>
        <input type="text" id="c4" value="72">
        <br>
        <label>Rotate Right (arrow_right): </label>
        <input type="text" id="c5" value="79">
        <br>

        <input type="button" value="StartGame" onclick="init();">
        <br>
        <br>
        <form method="get">
        <label>Score :</label>
        <input type="number"  id="score" name="score" value="<?php echo remember('score')?>" required readonly>
        <br>
        <label>Line: </label>
        <input type="number" id="line" value="0" readonly>
        <br>
        <label>Piece: </label>
        <input type="number" id="piece" value="0" readonly>
        <br>
        <label>Speed: </label>
        <input type="number" id="speed" value="300" readonly>
        <br>
        <br>
        <input type="hidden" id="color" value="0">
        <label>Name :</label>
        <input type="text"  id="name" name="name" value="<?php echo remember1('name')?>" required >
        <br>
        <input type="submit" name="SendScore" value="Enregistrer score">
        </form>
        <?php 
        $check = 1;
        $check1 = 0;
        $server = "localhost";
        $user = "root";
        $pass = "";
        $db = "scores";
        $conn = null;
        if (isset ($_GET['SendScore'])){
            echo "Enregistrement effectué";
                        
                        try {
                            $conn = new PDO("mysql:host=$server;dbname=$db", $user, $pass);
                            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                        
                            $stmt = $conn->prepare("insert into score(score, nom) values (:score, :name)");
                            $res = $stmt->execute([":name" => $_GET['name'], ":score" => $_GET['score']]);
                                
                            $stmt->closeCursor();
                        }
                        catch(PDOException $e)
                        {
                            echo "Error ".$e->getCode()." : ".$e->getMessage()."<br/>".$e->getTraceAsString();
                        }
                        finally {
                            $conn = null;
                        } 
        }

?>
    </div>
    

    <div class="column">
        <div style="display: flex; column-gap: 32pt; justify-content: space-around;">
            <canvas id="player_area" style="background-color: black; margin: -3;"></canvas>
        </div>
    </div>
    
    <div class="column">
    
        Leaderboard:
        <br>
       <?php 
            $check = 1;
            $check1 = 0;
            $server = "localhost";
            $user = "root";
            $pass = "";
            $db = "scores";
            $conn = null;
            try {
                $conn = new PDO("mysql:host=$server;dbname=$db", $user, $pass);
                $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            
                $stmt = $conn->prepare("select * from score order by score DESC");

                    $res = $stmt->execute();
            while ($line = $stmt->fetch(PDO::FETCH_ASSOC) AND $check1<= 2) {
                $check1 = $check1+1;
                echo $check1;
                echo ": ";
                echo $line["nom"] . " " . $line["score"] . "<br/>";
                
            }
        
            $stmt->closeCursor();
            }
            catch(PDOException $e)
            {
                echo "Error ".$e->getCode()." : ".$e->getMessage()."<br/>".$e->getTraceAsString();
            }
            finally {
                $conn = null;
            }
            ?>
    </div>
</div>

<script>
    const keys = { FALL: 0, LEFT: 0, ROTATE_L: 0, ROTATE_R: 0, RIGHT: 0, DOWN: 0 }
    function defKeys() {
        keys.LEFT = document.getElementById("c0").value;
        keys.RIGHT = document.getElementById("c1").value;
        keys.DOWN = document.getElementById("c2").value;
        keys.FALL = document.getElementById("c3").value;
        keys.ROTATE_L = document.getElementById("c4").value;
        keys.ROTATE_R = document.getElementById("c5").value;
    }
</script>
<script src="game.js"></script>
	</body>
</html>
