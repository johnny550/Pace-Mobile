<template>
  <v-container>
    <v-layout row>
      <v-flex>
        <v-card>
          <v-card-text>
            <v-card height="100px" flat>
              <div v-if="this.$store.getters.renderForMonth">
                <v-btn fab dark color="teal darken-1" @click="exportDataM">
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
                  <h1>Month:</h1>
                  <h2>{{elmese}}</h2>
                  <v-btn fab dark small color="primary" @click="setMonthPointerToPrevious">
                    <v-icon dark>remove</v-icon>
                  </v-btn>

                  <v-btn fab dark small color="indigo" @click="setMonthPointerToNext">
                    <v-icon dark>add</v-icon>
                  </v-btn>
                </div>
              </v-layout>
              <v-layout row align-center>
                <div
                  class="Chart"
                  style="position: relative; height:60vh; width:80vw"
                  v-if="this.$store.getters.renderForMonth"
                >
                  <month-graph></month-graph>
                </div>
                <div v-if="!this.$store.getters.renderForMonth">
                  <h1 style="position: relative; align: center">No data recorded for this month</h1>
                </div>
              </v-layout>
            </v-container>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
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
    exportDataM() {
      let Canvas = document.getElementById("line-chart");
      var imgData = Canvas.toDataURL("image/jpeg");
      var pdf = new jsPDF("landscape");
      //x then y
      pdf.setFontSize(22);
      pdf.text(100, 20, "User: " + this.$store.getters.email);
      pdf.text(
        80,
        40,
        "This data has been registered as abnormalities in " +
          this.$store.getters.monthPointer
      );
      pdf.addImage(imgData, "JPEG", 5, 50, 300, 140, "al", "NONE", 0);
      pdf.save("Data sum up _Month_.pdf");
    },
    setMonthPointerToPrevious(value) {
      //empty the X and Y axis data container located in the store
      this.$store.dispatch("emptyMonthDataArrays");
      var d = this.$store.getters.monthPointer;
      var theMonth = d.substring(0, d.indexOf("/"));
      var theYear = d.substring(d.lastIndexOf("/")).replace("/", "");
      var va = new Date(theYear, theMonth);

      va.setDate(va.getDate() - 1);

      var curr_month = va.getMonth();
      var curr_year = va.getFullYear();
      var myMonth = curr_month + "/" + curr_year;
      this.$store.commit("setMonthPointer", myMonth);
      this.$store.commit("setRenderForMonth", false);
      //console.log("after " + this.$store.getters.monthPointer);
      this.$store.dispatch("fetchUserData");
      console.log(
        this.$store.getters.monthPointer +
          "   contenu x:  " +
          this.$store.getters.userDataXAxis +
          "  y: " +
          this.$store.getters.userDataYAxis
      );
    },
    setMonthPointerToNext(value) {
      //empty the X and Y axis data container located in the store
      this.$store.dispatch("emptyMonthDataArrays");
      var d = this.$store.getters.monthPointer;
      var theMonth = d.substring(0, d.indexOf("/"));
      var theYear = d.substring(d.lastIndexOf("/")).replace("/", "");
      var va = new Date(theYear, theMonth);

      va.setDate(va.getDate() + 1);

      var curr_month = va.getMonth() + 1;
      var curr_year = va.getFullYear();
      var myday = curr_month + "/" + curr_year;
      this.$store.commit("setMonthPointer", myday);
      //console.log("after plus" + this.$store.getters.monthPointer);
      this.$store.commit("setRenderForMonth", false);
      this.$store.dispatch("fetchUserData");
      console.log(
        this.$store.getters.monthPointer +
          "   contenu x:  " +
          this.$store.getters.userDataXAxis +
          "  y: " +
          this.$store.getters.userDataYAxis
      );
    }
  },
  computed: {
    calItems() {
      let calItems = [
        { icon: "calendar_today", title: "Day", link: "/dashboard" },
        { icon: "date_range", title: "Month", link: "/graphM" },
        { icon: "calendar_view_day", title: "Year", link: "/graphY" }
      ];
      return calItems;
    },
    elmese: {
      get() {
        return this.$store.getters.monthPointer;
      }
    }
  }
};
</script>