<?php // @codingStandardsIgnoreFile

try {
  // check PHP version
  if (PHP_VERSION_ID < 50306) {
      die('Pico requires PHP 5.3.6 or above to run');
  }
} catch (Exception $e) {
  echo $e->getMessage();
  exit(1);
}

try {
  // load dependencies
  require_once(__DIR__ . '/vendor/autoload.php');
} catch (Exception $e) {
  echo $e->getMessage();
  exit(1);
}
try {
  // instance Pico
  $pico = new Pico(
      __DIR__,    // root dir
      'config/',  // config dir
      'plugins/', // plugins dir
      'themes/'   // themes dir
  );
} catch (Exception $e) {
  echo $e->getMessage();
  exit(1);
}

try {
  // run application
  echo $pico->run();
} catch (Exception $e) {
  echo $e->getMessage();
  exit(1);
}

?>
