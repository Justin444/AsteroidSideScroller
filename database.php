<html>
<body>
<form action = "database.php" method = "POST">
</form>
<?php
if(isset($_POST['submit']))
{
$link = mysql_connect("sftweb01", "drouin", "shayne");
mysql_select_db("drouin" );

$query = "SELECT * FROM SCORE_T";
mysql_query($db, $query) or die('Error querying database.');

$result = mysql_query($db, $query);
$row = mysql_fetch_array($result);

while ($row = mysql_fetch_array($result));
echo $row['score_name']. ' ' . $row['score_points'] . ':' . $row['score_time'] .'<br/>';
}

mysql_close( $link );
?>
</body>
</html>