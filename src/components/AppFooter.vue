<template>
  <div>
    <v-footer height="auto">
      <v-card class="flex" flat tile>
        <v-card-title class="light-blue accent-2">
          <strong class="subheading">Follow us!</strong>

          <v-btn v-for="icon in icons" :key="icon" class="mx-3" dark icon>
            <v-icon size="24px">{{ icon }}</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-actions class="grey darken-2 justify-center white--text">&copy;2018 —
          <strong>FALL Jonathan</strong>
        </v-card-actions>
      </v-card>
    </v-footer>
  </div>
</template>

<script>
export default {
  data: () => ({
    icons: ["facebook", "twitter_box", "google_plus", "instagram", "fab fa-linkedin"]
  })
};
</script>