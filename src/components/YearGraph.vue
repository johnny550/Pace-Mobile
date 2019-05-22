<template>
  <v-container>
    <v-layout row>
      <v-flex>
        <v-card>
          <v-card-text>
            <v-card height="100px" flat>
              <div v-if="this.$store.getters.renderForYear">
                <v-btn fab dark color="teal darken-1" @click="exportDataY">
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
                  <h1>Year:</h1>
                  <h2>{{elano}}</h2>
                  <v-btn fab dark small color="primary" @click="setYearPointerToPrevious">
                    <v-icon dark>remove</v-icon>
                  </v-btn>

                  <v-btn fab dark small color="indigo" @click="setYearPointerToNext">
                    <v-icon dark>add</v-icon>
                  </v-btn>
                </div>
                <div
                  class="Chart"
                  style="position: relative; height:60vh; width:80vw"
                  v-if="this.$store.getters.renderForYear"
                >
                  <year-graph></year-graph>
                </div>
                <div v-if="!this.$store.getters.renderForYear">
                  <h1 style="position: relative; align: center">No data recorded in this year</h1>
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

  computed: {
    calItems() {
      let calItems = [
        { icon: "calendar_today", title: "Day", link: "/dashboard" },
        { icon: "date_range", title: "Month", link: "/graphM" },
        { icon: "calendar_view_day", title: "Year", link: "/graphY" }
      ];
      return calItems;
    },
    elano: {
      get() {
        return this.$store.getters.yearPointer;
      }
    }
  },
  methods: {
    exportDataY() {
      let Canvas = document.getElementById("line-chart");
      var imgData = Canvas.toDataURL("image/jpeg");
      var pdf = new jsPDF("landscape");
       pdf.setFontSize(22);
      pdf.text(100,20,"User: "+this.$store.getters.email)
      pdf.text(80, 40,"This data has been registered as abnormalities on "+this.$store.getters.yearPointer)
      pdf.addImage(imgData, "JPEG", 5, 50, 300, 140, "al", "NONE", 0);
      pdf.save("Data sum up _Year_.pdf");
    },
    setYearPointerToPrevious(value) {
      var theYear = this.$store.getters.yearPointer;
      var va = new Date();

      //va.setDate(va.getDate() - 1);

      var myYear = theYear - 1;
      this.$store.commit("setYearPointer", myYear);
      console.log("after " + this.$store.getters.yearPointer);
      this.$store.dispatch("getYearData");
    },
    setYearPointerToNext(value) {
      var d = this.$store.getters.yearPointer;
      var va = new Date();

      var myYear = d + 1;
      this.$store.commit("setYearPointer", myYear);
      //console.log("after plus" + this.$store.getters.monthPointer);
      this.$store.dispatch("getYearData");
    }
  }
};
</script>