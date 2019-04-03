import { Line } from 'vue-chartjs'
export default ({
    extends: Line,
    data() {
        return {
            xAxisM: [],
            yAxisM: [],
            title: "Heart rates"
        }
    },
    computed: {
        xData: function () {

            for (var i = 0; i < this.$store.getters.userDataYAxis.length; i++) {
                this.yAxisM.push(this.$store.getters.userDataYAxis[i])
                //console.log('M now: ', this.yAxisM[i])

            }
        },
        yData: function () {
            for (var i = 0; i < this.$store.getters.userDataXAxis.length; i++) {
                this.xAxisM.push(this.$store.getters.userDataXAxis[i])
                // console.log('M daysnow: ', this.xAxisM[i])

            }
        }
    },
    watch: { // watch changes here

        xData: function (newV) {
            console.log('watch')
            // apply your logic here, e.g. invoke your listener function
            for (var i = 0; i < newV.length; i++) {
                this.yAxisM.push(newV[i])
                //console.log('M now: ', this.yAxisM[i])

            }
        },
        yData: function (newV) {
            for (var i = 0; i < newV.length; i++) {
                this.xAxisM.push(newV[i])
                // console.log('M daysnow: ', this.xAxisM[i])

            }
        }
    },
    methods: {
        renderLineChart: function () {
            if (this.xAxisM.length > 0 && this.yAxisM.length > 0) {
                if (this.$data._chart) {
                    this.$data._chart.destroy();
                    console.log("something got destroyed")
                }
                this.renderChart({
                    labels: this.xAxisM,
                    datasets: [
                        {
                            label: this.title,
                            backgroundColor: '#dd4b39',
                            data: this.yAxisM,
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

    }
})


//previous version
/* import { Line } from 'vue-chartjs'
export default ({
    extends: Line,
    data() {
        return {
            xAxisM: [],
            yAxisM: [],
            title: "Heart rates"
        }
    },
    computed: {
        xData: function () {

            return this.$store.getters.userDataYAxis
        },
        yData: function () {
            return this.$store.getters.userDataXAxis
        }
    },
    watch: { // watch changes here

        xData: function (newV) {
            console.log('watch')
            // apply your logic here, e.g. invoke your listener function
            for (var i = 0; i < newV.length; i++) {
                this.yAxisM.push(newV[i])
                console.log('M now: ', this.yAxisM[i])

            }
        },
        yData: function (newV) {
            for (var i = 0; i < newV.length; i++) {
                this.xAxisM.push(newV[i])
                console.log('M daysnow: ', this.xAxisM[i])

            }
        }
    },
    methods: {
        renderLineChart: function () {
            if (this.$data._chart) {
                this.$data._chart.destroy();
                console.log("something got destroyed")
            }
            this.renderChart({
                labels: this.xAxisM,
                datasets: [
                    {
                        label: this.title,
                        backgroundColor: '#dd4b39',
                        data: this.yAxisM,
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
}) */


