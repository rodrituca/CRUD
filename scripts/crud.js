const btnGet = document.getElementById("btnGet1");
const btnPost = document.getElementById("btnPost");
const btnPut = document.getElementById("btnPut");
const btnDelete = document.getElementById("btnDelete");
const results = document.getElementById("results");
const userID = document.getElementById("inputGet1Id");

//Botón de buscar ID con el método GET
btnGet.addEventListener("click", () => {
if (userID.value === "") { fetch("https://672ca27e1600dda5a9f93f95.mockapi.io/users", )
.then(response => response.json())
.then(data => { 
let resultText = '';
data.forEach(user => { resultText += `ID: ${user.id}<br> NAME: ${user.name}<br> LASTNAME: ${user.lastname}<br><br>`; });
results.innerHTML = resultText; })
.catch(error => { results.innerHTML = "Error al cargar la lista de usuarios."; });

} else {
fetch(`https://672ca27e1600dda5a9f93f95.mockapi.io/users/${userID.value}`)
.then(response => { if (!response.ok) { throw new Error("Usuario no encontrado"); }
return response.json(); })
.then(user => {
let resultText = `ID: ${user.id}<br> NAME: ${user.name}<br> LASTNAME: ${user.lastname}<br>`;
results.innerHTML = resultText;})
.catch(error => { results.innerHTML = "Error: " + error.message; }); }
});


// Botón de añadir objeto con el método POST
btnPost.addEventListener("click", () => {
    const addName = document.getElementById("inputPostNombre");
    const addLastName = document.getElementById("inputPostApellido");
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "name": addName.value,
      "lastname": addLastName.value
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    fetch("https://672ca27e1600dda5a9f93f95.mockapi.io/users", requestOptions)
    .then((response) => response.json())
    .then(() => {
        fetch("https://672ca27e1600dda5a9f93f95.mockapi.io/users")
          .then((response) => response.json())
          .then((users) => {
            let resultText = users.map(user => `ID: ${user.id}<br> NAME: ${user.name}<br> LASTNAME: ${user.lastname}<br><br>`).join('');
            document.getElementById("results").innerHTML = `<ul>${resultText}</ul>`;
          });
      })
      .catch((error) => console.error("Error:", error));
});


// Botón para eliminar elementos por su ID
btnDelete.addEventListener("click", () => {
    const deleteID = document.getElementById("inputDelete").value;
    
    fetch(`https://672ca27e1600dda5a9f93f95.mockapi.io/users/${deleteID}`, { method: "DELETE" })
      .then(response => {
        if (response.ok) {
          results.innerHTML = `Usuario con ID ${deleteID} eliminado correctamente.`;

          fetch("https://672ca27e1600dda5a9f93f95.mockapi.io/users")
            .then((response) => response.json())
            .then((users) => {
              let resultText = users.map(user => `ID: ${user.id}<br> NAME: ${user.name}<br> LASTNAME: ${user.lastname}<br><br>`).join('');
              document.getElementById("results").innerHTML = `<ul>${resultText}</ul>`;
            });
        } else {
          throw new Error("No se pudo eliminar el usuario.");
        }
      })
      .catch(error => { 
        results.innerHTML = "Error: " + error.message; 
      });
    });

// Botón para modificar elementos por su ID
btnPut.addEventListener("click", () => {
  const putID = document.getElementById("inputPutId").value;
  const newName = document.getElementById("inputPutNombre").value;
  const newLastName = document.getElementById("inputPutApellido").value;

  if (putID && newName && newLastName) {
    fetch(`https://672ca27e1600dda5a9f93f95.mockapi.io/users/${putID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "name": newName,
        "lastname": newLastName
      })
    })
      .then(response => response.json())
      .then(() => {
        results.innerHTML = `Usuario con ID ${putID} modificado correctamente.`;

        // Actualiza la lista de usuarios después de la modificación
        fetch("https://672ca27e1600dda5a9f93f95.mockapi.io/users")
          .then(response => response.json())
          .then(users => {
            let resultText = users.map(user => `ID: ${user.id}<br> NAME: ${user.name}<br> LASTNAME: ${user.lastname}<br><br>`).join('');
            document.getElementById("results").innerHTML = `<ul>${resultText}</ul>`;
          });
      })
      .catch(error => {
        results.innerHTML = "Error al modificar el usuario.";
      });
  } else {
    results.innerHTML = "Por favor, completa todos los campos para modificar el usuario.";
  }
});