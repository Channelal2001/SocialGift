<script>
import NavBar from './../components/NavBar.vue'
import language from './../components/language.vue'
import MiComponente from './../components/separarTrama.vue'


const token = localStorage.getItem('accessToken')

export default {
  name: 'ProfileView',
  components: {
    NavBar,
    language
  },
  data() {
  return {
    llistes: [],
    friendList: {
      friends: []
    },
    rutaID: null,
  }
},

  methods: {

  async Redirect(llistaID) {
    window.location.href = '/wishlist/' + llistaID
  },

  async RedirectFriends() {
    window.location.href = '/friends/' + this.rutaID
  },

  async obtainFriends(token, id) {
  try {
    const response = await fetch(`https://balandrau.salle.url.edu/i3/socialgift/api/v1/users/${id}/friends`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (response.status === 200) {
      const data = await response.json();
      this.friendList.friends = data;
    }
  } catch (error) {
    // Manejar el error de forma adecuada
  }
},

async addFriend(userId) {
      const token = localStorage.getItem('accessToken');

      fetch(`https://balandrau.salle.url.edu/i3/socialgift/api/v1/friends/${userId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json'
        }
      })
        .then(response => {
          if (response.status === 201) {
            // Aquí puedes realizar acciones adicionales después de enviar la solicitud
            console.log('Solicitud de amistad enviada con éxito');
            document.getElementById('AddFriendButton').style.backgroundColor = 'green';

          } else {
            document.getElementById('AddFriendButton').style.backgroundColor = 'red';
            throw new Error('Error al enviar la solicitud de amistad');
          }
        })
        .catch(error => {
          console.error(error);
          // Manejo de errores en caso de falla de la solicitud
        });
    }, 

  async obtainGifts(token, idgift,wishlistId) {
    try {
      for (let i = 0; i < idgift.length; i++) {
        const response = await fetch(`https://balandrau.salle.url.edu/i3/socialgift/api/v1/gifts/${idgift[i]}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
        });
        if (response.status === 200) {
          const data = await response.json();
          this.gifts[i] = data;
        }
      }
      
    } catch (error) {
      // Manejar el error de forma adecuada
    }
  },
  async obtainOwnWishlist(token, id) {
    try {
      const response = await fetch(`https://balandrau.salle.url.edu/i3/socialgift/api/v1/users/${id}/wishlists`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status === 200) {
        const data = await response.json();
        this.llistes = data;
        const giftIds = this.llistes.flatMap(llista => llista.gifts.map(gift => gift.id));
        const wishlistIds = this.llistes.map(llista => llista.id);

        await this.obtainGifts(token, giftIds,wishlistIds);
        await this.obtainFriends(token, id);
      }
    } catch (error) {
      // Manejar el error de forma adecuada
    }
  },

  async getRandomGradient() {
    const gridItems = document.getElementsByClassName('grid-item');
    const colors = [];

    for (let i = 0; i < gridItems.length; i++) {
      const color1 = '#' + Math.floor(Math.random() * 16777215).toString(16);
      const color2 = '#' + Math.floor(Math.random() * 16777215).toString(16);
      const gradient = `linear-gradient(to right, ${color1}, ${color2})`;
      colors.push([color1, color2]);
      gridItems[i].style.background = gradient;
    }

    console.log(colors);
    return colors;
  },
  toggleTaskBar(){
      const navigation = document.querySelector('.navigation');
      if (navigation) {
        navigation.style.display = 'block';
      }
    } 

},
  mounted() {
    const token = localStorage.getItem('accessToken')
    if (token === undefined || token === null) {
      window.location.href = '/'
    } else {
      //llamar a la funcion que separa
      const id = MiComponente.methods.obtenerIdDesdeToken(token)
      this.rutaID = this.$route.params.id; // Accede al ID de la lista desde la ruta
      if(this.rutaID != id){
        document.getElementById('EditProfileButton').style.display = 'none'
        document.getElementById('AddFriendButton').style.display = 'block'
      }
      //Hacer una peticion GET pasandole el email del usuario logueado
      fetch(`https://balandrau.salle.url.edu/i3/socialgift/api/v1/users/${this.rutaID}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
        .then((response) => {
          if (response.status === 200) {
            return response.json()
          }
        })
        .then((data) => {
          //mostrar el cotenido que nos devuelve el servidor
          document.getElementById('usernameJS').innerHTML = data.name
          document.getElementById('profileImageJS').src = data.image 
          this.obtainOwnWishlist(token, this.rutaID) // aquí agregamos el operador this
        })
        .catch((error) => {
          //Respuesta en caso de error de servidor
        })

    }
  }
}
</script>

<template>
  <div>
    <language />
    <a @click="toggleTaskBar()" class="togleNavBar" ><i class="fa-solid fa-bars"></i></a>

    <section id="GeneralSection">
      <NavBar />
    </section>

    <!--Mostrar perfil-->
    <section id="ProfileSection">
      <div>
        <div>
          <button  id="EditProfileButton"><a href="../editarperfil">Editar perfil</a></button>
          <button  id="AddFriendButton"><a @click="addFriend(this.rutaID)">Enviar Solicitud</a></button>

        </div>
        <div id="ProfileInfo">
          <div id="ProfileImage">
            <img id="profileImageJS" class="profileimg" src="" />
          </div>
          <div id="ProfileName">
            <h1 id="usernameJS"></h1>
          </div>
          <div id="UserCount">
            <h1>{{ llistes.length }}</h1>
            <h3>Listas</h3>
            <h1>{{ friendList.friends.length }}</h1>
            <a @click="RedirectFriends()"><h3>Amigos</h3></a>
          </div>
        </div>
      </div>
    </section>
    <hr />

    <div id="SelectList">
      <a href="#" id="Lists">WishLists</a>
    </div>
    <section id="PostSection">
      <div class="grid-container">
          <div   :style="{ backgroundColor: getRandomGradient() }" class="grid-item" v-for="llista in llistes" :key="llista.id" @click="Redirect(llista.id)">
            <li style=""><h3>{{ llista.name }}</h3></li>
            <li><h4>{{ llista.description }}</h4></li>
          </div>
      </div>
    </section>
  </div>
</template>

<style>
@media screen and (max-width: 600px) {
  #ProfileSection {
    margin-top: 0% !important;
    height: 50% !important;
  }

  #ProfilePicture {
    width: 90% !important;
    height: 90% !important;
  }

  #EditProfileButton {
    position: relative !important;
    margin-left: 67% !important;
    top: 50px !important;
    font-size: medium !important;
    width: 120px !important;
    height: 30px !important;
  }

  #AddFriendButton {
    position: relative !important;
    margin-left: 67% !important;
    top: 50px !important;
    font-size: medium !important;
    width: 120px !important;
    height: 50px !important;
  }

  #ProfileName {
    position: relative !important;
    left: -30px !important;
  }

  #UserCount {
    position: relative !important;
    left: -30px !important;
  }

  #ProfileDescription {
    position: relative !important;
    left: -30px !important;
  }


  #GeneralSection {
    margin-top: -10% !important;
  }

  hr {
    width: auto !important;
  }

  #SelectList a {
    font-family: 'Inter', sans-serif;
  }

  .grid-container {
    display: grid;
    margin-left: 4% !important;
    grid-template-columns: repeat(2, 1fr) !important;
    grid-template-rows: repeat(2, 1fr) !important;
    gap: 50px !important;
    width: 80vw; /* Ajusta el ancho del contenedor a la ventana */
    height: 10vh !important; /* Ajusta la altura del contenedor a la ventana */
  }

  .grid-item {
    height: 90% !important;
    width: 90% !important;
  }
}
</style>

<style scoped>
@import '../assets/ProfileStyle.css';
</style>
