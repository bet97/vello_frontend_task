<template>
  <div class="main">
    <font-awesome-icon :icon="['fas', 'remove']" class="closeIconMobile" />
    <h1>Bucket list</h1>
    <table>
      <thead>
        <tr>
          <td class="head">Done</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td class="head">Do before age</td>
          <td></td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in bucketList" :key="item.uuid">
          <td>
            <label class="container">
              <input
                type="checkbox"
                @click="updateItemCheck(item.uuid, (item.done = !item.done))"
              />
              <span class="checkmark"></span>
            </label>
          </td>
          <td>{{ item.description }}</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td>{{ item.do_before }}</td>
          <td class="optionButtonDialog">
            <div class="showMoreDots">
              <font-awesome-icon
                :icon="['fas', 'ellipsis']"
                class="dots"
                @click="item.isVisible = !item.isVisible"
              />
            </div>
            <div class="showMore" v-if="item.isVisible">
              <div class="onlyOnMobile">
                <h3>{{ item.description }}</h3>
                <font-awesome-icon
                  :icon="['fas', 'remove']"
                  @click="item.isVisible = !item.isVisible"
                  class="closeIconMobile"
                />
              </div>
              <div class="popUp">
                <font-awesome-icon :icon="['fas', 'calendar']" />
                Bucket item action 1
              </div>
              <div
                id="deleteBucketItem"
                class="popUp"
                @click="deleteItem(item.uuid)"
              >
                <font-awesome-icon :icon="['fas', 'remove']" id="deleteIcon" />
                Delete bucket item
              </div>
              <button
                @click="item.isVisible = !item.isVisible"
                class="onlyOnDesktop"
              >
                Done
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <div>
      <hr />
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      bucketList: [],
      loading: true,
      errored: false,
      isVisible: false,
    };
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
          `${import.meta.env.VITE_BASE_UR}item/${id}`,
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
          .delete(`${import.meta.env.VITE_BASE_UR}item/${id}`, {
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
    showItem(id, status) {
      if (status) {
        this.$set(this.statusShowItem, id, true);
      } else {
        this.statusShowItem[id] = false;
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
/* HTML elements css*/
td {
  padding: 10px;
  font-size: 0.875em;
  font-style: normal;
}
button {
  background: #002844;
  border: #002844;
  color: white;
  padding: 8px;
  border-radius: 8px;
  position: absolute;
  bottom: 0;
  right: 0;
  margin-bottom: -50px;
  justify-content: center;
  width: 50%;
}
hr {
  border: 1px solid #b5c5d0;
}
h1,
h3 {
  padding-left: 5%;
  font-weight: medium;
}
button:hover {
  background: #4a575f;
}
hr {
  width: 100%;
}

/* classes   */
.head {
  font-size: 0.6em;
}
.dots:hover,
.dots:focus,
.dots:active {
  border-radius: 50%;
  background: rgba(214, 224, 232, 1);
  cursor: pointer;
}
.showMore {
  background-color: #ffffff;
  box-shadow: 1px 1px 0px rgba(0, 40, 68, 0.09),
    -32.3816px -1.40789px 47.8684px -16.8947px rgba(2, 57, 95, 0.28),
    -64.7632px 59.1316px 30.9737px -49.2763px rgba(2, 57, 95, 0.23);
  border-radius: 16px;
  z-index: 1;
  position: fixed;
  padding: 12px;
}
.main {
  width: 60%;
  padding: 33px;
  margin: 0 auto;
  background: #ffffff;
  box-shadow: 1px 1px 0px rgba(0, 40, 68, 0.09),
    0px 13.59px 47.8684px -26.89px rgba(2, 57, 95, 0.2),
    0px 24.13px 50.97px -29.28px rgba(2, 57, 95, 0.23);
  border-radius: 16.8947px;
  position: relative;
}
.moveRight {
  text-align: right;
}

.popUp {
  padding: 10px;
}

.onlyOnMobile {
  display: none;
}

.onlyOnDesktop {
  display: block;
}

.closeIconMobile {
  color: rgba(153, 169, 180, 1);
  position: absolute;
  top: 15px;
  right: 15px;
}

#deleteBucketItem {
  color: #ff5093;
}
#deleteBucketItem:hover {
  color: #893e5b;
}

/* w3schools checkbox */

/* The container */
.container {
  display: block;
  position: relative;
  padding-left: 35px;
  margin-bottom: 12px;
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
.container input:checked ~ .checkmark:after {
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

/* optimize for mobile devices */

@media only screen and (max-width: 600px) {
  .main {
    width: 100%;
    padding: 0;
    font-size: 1em;
    overflow: hidden;
  }
  .showMore {
    margin-bottom: -5px;
    right: 0;
    bottom: 0;
    width: 94%;
    height: 35%;
  }
  .onlyOnMobile {
    display: flex;
    flex-direction: row;
    position: relative;
    padding: 15px;
  }
  .onlyOnDesktop {
    display: none;
  }
  hr {
    display: none;
  }
  .popUp {
    padding: 12px;
    margin-left: 20px;
  }
}
</style>
