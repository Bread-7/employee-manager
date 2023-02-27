# Header
oogabooga

## Heading level 2

Here is some text with an <span style="color:blue">inline blue text</span>.
<div>
  <p>This is a paragraph inside a div container.</p>
  
</div>

<button type="button"
onclick="document.getElementById('demo').innerHTML = Date()">
Click me to display Date and Time.</button>

<p id="demo"></p>

<label for="fname">First name:</label>
<input type="text" id="fname" name="fname"><br><br>
<input type="text" id="lname" name="lname"><br><br>
<input type="submit" id="submit_button" value="Submit">

<script type = "module">
  import square from '/scripts.js'
  console.log(square(3))
</script>

<button onclick="runPython()">Run Python</button>
  <script>
    function runPython() {
      // Make an AJAX request to a Python script
      var xhr = new XMLHttpRequest();
      xhr.open("GET", "index.py", true);
      xhr.send();
    }
  </script>