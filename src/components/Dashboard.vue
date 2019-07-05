<template>
  <v-container>
    <v-layout row v-if="this.$store.getters.emailVerified">
      <h2>{{message}}</h2>
      <v-flex>
        <v-card>
          <v-card-text>
            <v-card height="100px" flat>
              <div v-if="this.$store.getters.render">
                <v-btn fab dark color="teal darken-1" @click="exportData">
                  <v-icon dark>import_export</v-icon>
                </v-btn>
              </div>
              <v-bottom-nav :active.sync="bottomNav" :value="true" absolute color="transparent">
                <v-list-tile v-for="item in calItems" :key="item.title" router :to="item.link">
                  <div class="ml-4 mr-4 caption">
                    <v-list-tile-action>
                      <v-icon color="blue lighten-1">{{item.icon}}</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                      <span>
                        <v-list-tile-sub-title>{{item.title}}</v-list-tile-sub-title>
                      </span>
                    </v-list-tile-content>
                  </div>
                </v-list-tile>
              </v-bottom-nav>
            </v-card>

            <v-container>
              <v-layout row align-center>
                <div class="text-xs-center">
                  <h1>Date:</h1>
                  <h2>{{eldia}}</h2>
                  <v-btn fab dark small color="primary" @click="setPointerToPrevious">
                    <v-icon dark>remove</v-icon>
                  </v-btn>

                  <v-btn fab dark small color="indigo" @click="setPointerToNext">
                    <v-icon dark>add</v-icon>
                  </v-btn>
                </div>
                <div
                  class="Chart"
                  style="position: relative; height:60vh; width:80vw"
                  v-if="this.$store.getters.render"
                >
                  <dash-graph></dash-graph>
                </div>
                <div v-if="!this.$store.getters.render">
                  <h1 style="position: relative; align: center">No data to display</h1>
                </div>
              </v-layout>
            </v-container>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout row justify-center v-if="!this.$store.getters.emailVerified" class="grey darken-4">
      <img :src="activeGIF" />
      <v-dialog v-model="dialog" light hide-overlay persistent max-width="290">
        <v-card>
          <v-card-title class="headline">Want to be secure?</v-card-title>
          <v-card-text>A verification notice has been sent toward your email address</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" flat @click="dialog = false">OK</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
  </v-container>
</template>

<script>
import * as firebase from "firebase";
var gifs = [
  "https://cdn.dribbble.com/users/106600/screenshots/2150230/dribbble-loader-green.gif",
  "https://i.gifer.com/4RNk.gif",
  "https://media.giphy.com/media/xTk9ZvMnbIiIew7IpW/giphy.gif",
  "https://media.giphy.com/media/IwSG1QKOwDjQk/giphy.gif"
];
export default {
  data() {
    return {
      bottomNav: "recent",
      dialog: true,
      gifs,
      activeGIF: null
    };
  },
  created() {
    if (firebase.auth().currentUser.emailVerified) {
      this.$store.commit("setEmailVerified", true);
    } else {
      //e.preventDefault();
      let index = Math.floor(Math.random() * 3 + 1);
      this.activeGIF = this.gifs[index];
      console.log("created  " + this.activeGIF);
    }
  },
  methods: {
    exportData() {
      let Canvas = document.getElementById("line-chart");
      var imgData = Canvas.toDataURL("image/jpeg");
      var pdf = new jsPDF("landscape");
      pdf.setFontSize(22);
      pdf.text(100, 20, "User: " + this.$store.getters.email);
      pdf.text(
        80,
        40,
        "This data has been registered as abnormalities on " +
          this.$store.getters.datePointer
      );
      pdf.addImage(imgData, "JPEG", 5, 50, 300, 140, "al", "NONE", 0);
      pdf.save("Data sum up _Day_.pdf");
    },
    setPointerToPrevious(value) {
      //empty the X and Y axis data container located in the store
      this.$store.dispatch("emptyDayDataArrays");
      var d = this.$store.getters.datePointer;
      var theDate = d.substring(0, d.indexOf("/"));
      var theMonth =
        d.substring(d.indexOf("/"), d.lastIndexOf("/")).replace("/", "") - 1;
      var theYear = d.substring(d.lastIndexOf("/")).replace("/", "");
      var va = new Date(theYear, theMonth, theDate);

      va.setDate(va.getDate() - 1);

      var curr_date = va.getDate();
      var curr_month = va.getMonth() + 1;
      var curr_year = va.getFullYear();
      var myday = curr_date + "/" + curr_month + "/" + curr_year;
      this.$store.commit("setDatePointer", myday);
      console.log("after " + this.$store.getters.datePointer);
      this.$store.commit("setRender", false);
      this.$store.dispatch("dataPerDay");
    },

    setPointerToNext(value) {
      //empty the X and Y axis data container located in the store
      this.$store.dispatch("emptyDayDataArrays");
      var d = this.$store.getters.datePointer;
      var theDate = d.substring(0, d.indexOf("/"));
      var theMonth =
        d.substring(d.indexOf("/"), d.lastIndexOf("/")).replace("/", "") - 1;
      var theYear = d.substring(d.lastIndexOf("/")).replace("/", "");
      var va = new Date(theYear, theMonth, theDate);

      va.setDate(va.getDate() + 1);

      var curr_date = va.getDate();
      var curr_month = va.getMonth() + 1;
      var curr_year = va.getFullYear();
      var myday = curr_date + "/" + curr_month + "/" + curr_year;
      this.$store.commit("setDatePointer", myday);
      //console.log("after plus" + this.$store.getters.datePointer);
      this.$store.commit("setRender", false);
      this.$store.dispatch("dataPerDay");
    }
  },
  computed: {
    message() {
      return this.$store.getters.message;
    },
    calItems() {
      let calItems = [
        { icon: "calendar_today", title: "Day", link: "" },
        { icon: "date_range", title: "Month", link: "/graphM" },
        { icon: "calendar_view_day", title: "Year", link: "/graphY" }
      ];
      //console.log("bef "+ this.$store.getters.datePointer)
      return calItems;
    },
    eldia: {
      get() {
        return this.$store.getters.datePointer;
      }
    }
  }
};
</script>

