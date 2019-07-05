import { Line /*mixins*/ } from 'vue-chartjs'
export default ({
    extends: Line,
    //mixins: [mixins.reactiveProp],
    data() {
        return {
            xAxisY: [],
            yAxisY: [],
            title: "Heart BpM ("+this.$store.getters.yearPointer+")"
        }
    },
    computed: {
        xDataY: function () {
            for (var i = 0; i < this.$store.getters.xAxisPerYear.length; i++) {
                this.xAxisY.push(this.$store.getters.xAxisPerYear[i])
               // console.log('x axis: ', this.yAxisY[i])

            }
        },
        yDataY: function () {
            for (var i = 0; i < this.$store.getters.yAxisPerYear.length; i++) {
                this.yAxisY.push(this.$store.getters.yAxisPerYear[i])
               // console.log('Y axis: ', this.xAxisY[i])

            }
        },

    },
    watch: { // watch changes here
        xDataY: function (newV, oldV) {
            console.log('watch')
        for (var i = 0; i < newV.length; i++) {
        this.xAxisY.push(newV[i])
        //console.log('Y daysnow: w ', this.xAxisY[i])

   }
        },
        yDataY: function (newV) {
           // for (var i = 0; i < newV.length; i++) {
                this.yAxisY.push(newV[i])
                 //console.log('Y daysnow: w ', this.yAxisY[i])

            //}
        }
    },
    methods: {       
        /*chartData:{
        handler: function(newVal, oldVal) {
          this.$data._chart.update()
        },*/
        renderLineChart: function () {
            if (this.xAxisY.length > 0 && this.yAxisY.length > 0) {
                if (this.$data._chart) {
                    this.$data._chart.destroy();
                    console.log("something got destroyed")
                }
                this.renderChart({
                    labels: this.xAxisY,
                    datasets: [
                        {
                            label: this.title,
                            backgroundColor: '#dd4b39',
                            data: this.yAxisY,
                            borderColor: '#FC2525',
                            pointBackgroundColor: 'white',
                            borderWidth: 1,
                            pointBorderColor: 'white',
                            backgroundColor: this.gradient1,
                            //height: 100
                        }
                    ]
                },
                    { responsive: true, maintainAspectRatio: false })
                this.$store.commit('setRenderForMonth', true)
            }
            else {
                console.log("done")
                this.$store.commit('setRenderForMonth', false)
            }

        }

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
        this.xData
        this.yData
        this.renderLineChart()
        //added
        // this.$data._chart.update()

    }
})

