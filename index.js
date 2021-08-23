fetch("http://localhost:3000/attractions")
.then(resp => resp.json())
.then(data => console.log(data))