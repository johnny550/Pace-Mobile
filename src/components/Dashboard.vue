<template>
  <v-container>
    <v-layout row>
      <h2>{{message}}</h2>
      <v-flex>
        <v-card>
          <v-card-text>
            <v-card height="100px" flat>
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
              <!--work with these in case of a problem with the bottom nav-->
              <!-- <div class="ml-4 mr-4 caption">
                 <v-icon color="blue lighten-1" >calendar_today</v-icon>
                 <v-icon @click="clickMethod" color="blue lighten-1" >date_range</v-icon>
                 <v-icon color="blue lighten-1" >calendar_view_day</v-icon>
              </div>-->
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
    <v-layout row></v-layout>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      bottomNav: "recent"
    };
  },
  methods: {
    setPointerToPrevious(value) {
      //empty the X and Y axis data container located in the store
      this.$store.dispatch("emptyDayDataArrays")
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
      this.$store.commit("setRender", false)
      this.$store.dispatch("dataPerDay");
    },

    setPointerToNext(value) {
      //empty the X and Y axis data container located in the store
      this.$store.dispatch("emptyDayDataArrays")
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
      console.log("after plus" + this.$store.getters.datePointer);
      this.$store.commit("setRender", false)
      this.$store.dispatch("dataPerDay");
    }
  },
  computed: {
    message(){
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

