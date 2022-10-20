<template>
  <div class="main">
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
          <td class="head">Do before age</td>
          <td></td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in bucketList" :key="item.uuid">
          <td>
            <input
              type="checkbox"
              @click="updateItemCheck(item.uuid, (item.done = !item.done))"
            />
          </td>
          <td>{{ item.description }}</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td>{{ item.do_before }}</td>
          <td>
            <div class="moveright">
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
                  id="closeIconMobile"
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
import { API_KEY, baseUrl } from "./constants";
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
        .get(`${baseUrl}item`, {
          headers: { "api-key": API_KEY },
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
          `${baseUrl}item/${id}`,
          {
            done: done,
          },
          {
            headers: { "api-key": API_KEY },
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
          .delete(`${baseUrl}item/${id}`, {
            headers: { "api-key": API_KEY },
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
td {
  padding: 10px;
  font-size: 0.875em;
  font-style: normal;
}
.head {
  font-size: 0.6em;
}

button {
  background-color: #002844;
  color: white;
  padding: 11px;
  border-radius: 8px;
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

.dots:hover {
  border-radius: 50%;
  background-color: rgba(214, 224, 232, 1);
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

/* toto nefunguje ?? */
input:checked {
  background: #002844;
  border: 1px solid #002844;
  border-radius: 4px;
}

input:hover {
  background: #f5f5f5;
  border: 1px solid #67889f;
  border-radius: 4px;
}

.onlyOnMobile {
  display: none;
}

.onlyOnDesktop {
  display: block;
  text-align: right;
}

hr {
  width: 100%;
}

#deleteIcon {
  color: #ff5093;
}
.classChange {
  color: #ff5093;
}
/* optimize for mobile deices */

@media only screen and (max-width: 600px) {
  .main {
    width: 100%;
    padding: 0;
    font-size: 1em;
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
  #closeIconMobile {
    color: rgba(153, 169, 180, 1);
    position: absolute;
    top: 10px;
    right: 10px;
  }
}
</style>
