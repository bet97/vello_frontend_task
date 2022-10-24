<template>
  <div class="wrapper" id="app">
    <div class="title-block">
      <div id="cross-position">
        <img src="src/media/grayxMobile.svg" class="close-icon-mobile" />
      </div>
      <div class="title-text">
        <h1>Bucket list</h1>
      </div>
    </div>

    <div class="t-head">
      <div class="done">Done</div>
      <div></div>
      <div class="do-before-age" id="do-before-heading">Do before age</div>
    </div>

    <div class="main-row" v-for="item in bucketList" :key="item.uuid">
      <div class="input-cell">
        <label class="container">
          <input
            type="checkbox"
            v-model="item.done"
            @click="updateItemCheck(item.uuid, (item.done = !item.done))"
          />
          <span class="checkmark"></span>
        </label>
      </div>
      <div class="description" id="description-text">
        {{ item.description }}
      </div>
      <div class="do-before-age" id="do-before-text">{{ item.do_before }}</div>
      <div
        class="show-more-dots"
        v-click-outside="() => close(item.isVisible, item.uuid)"
      >
        <button class="circle" @click="item.isVisible = !item.isVisible">
          <font-awesome-icon :icon="['fas', 'ellipsis']" class="dots" />
        </button>
        <div id="dots-position">
          <div class="show-more" v-if="item.isVisible">
            <div class="only-on-mobile">
              <h3>{{ item.description }}</h3>
              <img
                src="src/media/grayxMobile.svg"
                @click="item.isVisible = !item.isVisible"
                class="close-icon-mobile"
              />
            </div>
            <div class="pop-up">
              <img src="src/media/calendar.svg" />
              Bucket item action 1
            </div>
            <div
              id="delete-bucket-item"
              class="pop-up"
              @click="deleteItem(item.uuid)"
            >
              <img src="src/media/redx.svg" id="delete-item-cross" />
              Delete bucket item
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer-row">
      <button class="done-button">Done</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

const clickOutside = {
  beforeMount: (el, binding) => {
    el.clickOutsideEvent = (event) => {
      if (!(el == event.target || el.contains(event.target))) {
        binding.value();
      }
    };
    document.addEventListener("click", el.clickOutsideEvent);
  },
  unmounted: (el) => {
    document.removeEventListener("click", el.clickOutsideEvent);
  },
};

export default {
  data() {
    return {
      bucketList: [],
      loading: true,
      errored: false,
      isVisible: false,
    };
  },
  directives: {
    clickOutside,
  },
  mounted() {
    this.bucketList = this.fetchData();
  },
  methods: {
    fetchData() {
      axios
        .get(`${import.meta.env.VITE_BASE_URL}item`, {
          headers: { "api-key": import.meta.env.VITE_APP_API_KEY },
        })
        .then(
          (response) =>
            (this.bucketList = response.data.data.map((item) => ({
              ...item,
              isVisible: false,
            })))
        )
        .catch((error) => {
          console.log("error: ", error.message);
          this.errored = true;
        })
        .finally(() => (this.loading = false));
    },

    updateItemCheck(id, done) {
      axios
        .put(
          `${import.meta.env.VITE_BASE_URL}item/${id}`,
          {
            done: done,
          },
          {
            headers: { "api-key": import.meta.env.VITE_APP_API_KEY },
          }
        )
        .then((response) => response)
        .catch((error) => {
          console.log("error: ", error.message);
          this.errored = true;
        })
        .finally(() => (this.loading = false));
    },

    deleteItem(id) {
      if (confirm("Do you really want to delete this item?")) {
        axios
          .delete(`${import.meta.env.VITE_BASE_URL}item/${id}`, {
            headers: { "api-key": import.meta.env.VITE_APP_API_KEY },
          })
          .then((response) => response)
          .catch((error) => {
            console.log("error: ", error.message);
            this.errored = true;
          })
          .finally(() => (this.loading = false));
        setTimeout(
          () =>
            (this.bucketList = this.bucketList.filter(
              (item) => item.uuid !== id
            )),
          1000
        );
      }
    },
    close(event, id) {
      if (event === true) {
        this.bucketList.find((item) => item.uuid === id).isVisible = !event;
      }
    },
  },
};
</script>

<style>
* {
  font-family: "Open Sans";
  line-height: 150%;
  letter-spacing: 0.25px;
  color: #002844;
}
/* HTML elements */
button {
  background: transparent;
  border: none;
  color: transparent;
}
h1,
h3 {
  padding-left: 5%;
  font-weight: medium;
}

img {
  padding-right: 15px;
}

/* classes   */

.dots {
  cursor: pointer;
  z-index: 1;
  width: 15px;
  height: 15px;
  border-radius: 50%;
}

.circle:hover,
.circle:active,
.circle:focus {
  border-radius: 50%;
  background: rgba(214, 224, 232, 1);
  width: 25px;
  height: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
}

#dots-posiion {
  position: relative;
}

.show-more {
  box-shadow: 1px 1px 0px rgba(0, 40, 68, 0.09),
    -32.3816px -1.40789px 47.8684px -16.8947px rgba(2, 57, 95, 0.28),
    -64.7632px 59.1316px 30.9737px -49.2763px rgba(2, 57, 95, 0.23);
  border-radius: 16px;
  z-index: 1;
  background-color: #ffffff;
  padding: 12px;
  position: fixed;
}

.pop-up {
  padding: 10px;
  display: flex;
  flex-direction: row;
}

.only-on-mobile {
  display: none;
}

.done-button {
  display: block;
  margin-top: 2%;
  width: 15%;
  background: #002844;
  border: #002844;
  color: white;
  padding: 10px;
  border-radius: 8px;
  width: 18%;
  margin-top: 15px;
  font-weight: 700;
}

.done-button:hover {
  background: #4a575f;
}

.close-icon-mobile {
  color: rgba(153, 169, 180, 1);
  top: 15px;
  right: 0;
}

#delete-bucket-item {
  color: #ff5093;
}
#delete-bucket-item:hover,
#delete-item-cross:hover {
  color: #893e5b;
}

#cross-position {
  text-align: right;
}

/* w3schools checkbox */

/* The container */
.container {
  display: block;
  position: relative;
  padding-left: 20px;
  margin-bottom: 18px;
  cursor: pointer;
  font-size: 22px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* Hide the browser's default checkbox */
.container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

/* Create a custom checkbox */
.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 20px;
  width: 20px;
  background: #ffffff;
  border: 1px solid #67889f;
  border-radius: 4px;
}

/* On mouse-over, add a grey background color */
.container:hover input ~ .checkmark {
  background: #f5f5f5;
  border: 1px solid #67889f;
}

.container:active input ~ .checkmark {
  background: #ccd7df;
  border: 1px solid #67889f;
}

/* When the checkbox is checked, add a blue background */
.container input:checked ~ .checkmark {
  background: #002844;
  border: 1px solid #002844;
}

/* Create the checkmark/indicator (hidden when not checked) */
.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

/* Show the checkmark when checked */
input:checked ~ .checkmark:after {
  display: block;
}

/* Style the checkmark/indicator */
.container .checkmark:after {
  left: 6.3px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 3px 3px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}

/* grid */
.wrapper {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: minmax(40px, auto);
  grid-auto-columns: min-content auto;
  margin: 0 auto;
  padding: 20px;
  background: #ffffff;
  box-shadow: 1px 1px 0px rgba(0, 40, 68, 0.09),
    0px 13.59px 47.8684px -26.89px rgba(2, 57, 95, 0.2),
    0px 24.13px 50.97px -29.28px rgba(2, 57, 95, 0.23);
  border-radius: 16.8947px;
  width: 55%;
  row-gap: 10px;
}

.t-head,
.title-block {
  grid-column: span 5;
  display: grid;
  grid-template-columns: 80px repeat(2, 1fr) 65px;
}

.t-head {
  grid-column: span 5;
}

.title-text {
  grid-column: 1 / span 3;
}

#cross-position {
  grid-column: 3 / span 3;
}

.description {
  grid-column: 2 / 1 span;
  display: flex;
  justify-content: left;
  align-items: center;
}

.done {
  grid-column: 1 / span 1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Open Sans";
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 120%;
  letter-spacing: 0.25px;
  color: #002844;
}

.do-before-age {
  display: flex;
  justify-content: right;
  align-items: center;
  grid-column: 3 / span 1;
}

#do-before-heading {
  font-family: "Open Sans";
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 120%;
  text-align: right;
  letter-spacing: 0.25px;
  color: #002844;
}

#do-before-text {
  font-family: "Roboto Mono";
  font-style: normal;
  font-weight: 400;
  font-size: 0.95em;
  line-height: 120%;
  letter-spacing: 0.5px;
  color: #002844;
}

#description-text {
  font-family: "Open Sans";
  font-style: normal;
  line-height: 120%;
  letter-spacing: 0.25px;
  font-size: 0.875em;
  color: #002844;
}

.main-row {
  grid-column: span 4;
  display: grid;
  grid-template-columns: 80px 1fr 20% 60px;
}

.show-more-dots,
.input-cell {
  display: flex;
  justify-content: center;
  align-items: center;
}
.footer-row {
  grid-column: span 5;
  grid-column: 1 / 5 span;
  display: flex;
  justify-content: right;
  align-items: right;
  border-top: 1px solid #b5c5d0;
}

/* optimize for mobile devices */

@media only screen and (max-width: 600px) {
  .wrapper {
    width: 100%;
    padding: 0;
    font-size: 1em;
    row-gap: 0.875rem;
    line-height: 21x;
    background: #ffffff;
    box-shadow: none;
  }
  .show-more {
    margin-bottom: -5px;
    right: 0;
    bottom: 0;
    width: 94%;
    height: 35%;
    background: #ffffff;
    box-shadow: 0px -1px 5px -2px rgba(0, 40, 68, 0.1),
      0px -30px 51px -15px rgba(2, 57, 95, 0.15);
    border-radius: 32px 32px 0px 0px;
    z-index: 1;
  }
  .only-on-mobile {
    display: flex;
    flex-direction: row;
    position: relative;
    padding: 15px;
  }
  .pop-up {
    padding: 12px;
    margin-left: 20px;
  }
  .container {
    margin-bottom: 22px;
  }
  .footer-row {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .done-button {
    margin-top: 10%;
    width: 35%;
    padding: 14px;
  }
  .close-icon-mobile {
    top: 15px;
    right: 0;
    position: absolute;
  }
}
</style>
