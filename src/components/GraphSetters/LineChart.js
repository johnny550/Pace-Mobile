import { Line } from 'vue-chartjs'
export default ({
    extends: Line,
    data() {
        return {
            xAxis: [],
            yAxis: [],
            title: "Heart rates ("+this.$store.getters.datePointer+")"
        }
    },
    computed: {
        averageNumbers: function () {
            console.log('computed')
             
            for (var i = 0; i < this.$store.getters.userData.length; i++) {
                this.yAxis.push(this.$store.getters.userData[i])
                // console.log(' now: ', this.yAxis[i])
            }
        },
        daysItems: function () {
           // return this.$store.getters.timestamps
           for (var i = 0; i < this.$store.getters.timestamps.length; i++) {
            this.xAxis.push(this.$store.getters.timestamps[i])
            //console.log(' daysnow: ', this.xAxis[i])
        }
        }
    },
    watch: { // watch changes here

        averageNumbers: function (newValue) {
            console.log('watch')
            // apply your logic here, e.g. invoke your listener function
            for (var i = 0; i < newValue.length; i++) {
                //this.yAxis.push(newValue[i])
                // console.log(' now: ', this.yAxis[i])

            }
        },
        /*xAxis :function (ol,ne){
            this.averageNumbers
        },*/
        daysItems: function (newVal) {
            for (var i = 0; i < newVal.length; i++) {
                //this.xAxis.push(newVal[i])
                //console.log(' daysnow: ', this.xAxis[i])

            }
        }
        /* xAxis :function (ol,ne){
             this.daysItems
         },*/
    },
    methods: {
        renderLineChart: function () {
            if (this.xAxis.length > 0 && this.yAxis.length > 0) {
                if (this.$data._chart) {
                    this.$data._chart.destroy();
                    console.log("something got destroyed")
                }
                this.renderChart({
                    labels: this.xAxis,
                    datasets: [
                        {
                            label: this.title,
                            backgroundColor: '#dd4b39',
                            data: this.yAxis,
                            borderColor: '#FC2525',
                            pointBackgroundColor: 'white',
                            borderWidth: 1,
                            pointBorderColor: 'white',
                            backgroundColor: this.gradient2,
                            //height: 100
                        }
                    ]
                },
                    { responsive: true, maintainAspectRatio: false })
                    this.$store.commit('setRender', true)
            }
            else{
                console.log("no data")
                this.$store.commit('setRender', false)
            }

        },
    },

    mounted() {
        this.gradient = this.$refs.canvas.getContext('2d').createLinearGradient(0, 0, 0, 450)
        this.gradient2 = this.$refs.canvas.getContext('2d').createLinearGradient(0, 0, 0, 450)

        this.gradient.addColorStop(0, 'rgba(255, 0,0, 0.5)')
        this.gradient.addColorStop(0.5, 'rgba(255, 0, 0, 0.25)');
        this.gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');

        this.gradient2.addColorStop(0, 'rgba(0, 231, 255, 0.9)')
        this.gradient2.addColorStop(0.5, 'rgba(0, 231, 255, 0.25)')
        this.gradient2.addColorStop(1, 'rgba(0, 231, 255, 0)')
        //this.averageNumbers
        //this.daysItems
        console.log("mounted")
        this.renderLineChart()
        //added
        // this.$data._chart.update()

    }
})