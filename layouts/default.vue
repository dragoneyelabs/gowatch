<template>
  <v-app>
    <v-app-bar
      class="px-2"
      height="80"
      elevation="0"
      hide-on-scroll
      fixed
    >
      <v-container>
        <v-row
          align-content="center"
          align="center"
        >
          <v-col cols="auto">
            <h2>
              <v-icon
                class="mt-n1 mr-3"
                x-large
              >
                mdi-watch
              </v-icon>
              Gowatch 2.0
            </h2>
          </v-col>

          <v-spacer />

          <v-col cols="auto">
            <nav>
              <v-badge
                :content="shoppedWatchesCountStr"
                :value="shoppedWatchesCount > 0"
                color="pink"
                overlap
              >
                <v-btn
                  x-large
                  icon
                  @click="drawer = true"
                >
                  <v-icon>mdi-cart</v-icon>
                </v-btn>
              </v-badge>
            </nav>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>

    <main class="main-content pa-3">
      <nuxt />
    </main>

    <v-navigation-drawer
      v-model="drawer"
      :width="$vuetify.breakpoint.smAndUp ? '360' : '100%'"
      temporary
      right
      app
    >
      <v-row
        justify="center"
        no-gutters
      >
        <v-col
          cols="auto"
          class="pt-4 px-6"
        >
          <v-btn
            icon
            @click="drawer = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-col>
      </v-row>

      <v-subheader>Selected watches ({{ shoppedWatchesCount }})</v-subheader>
      <v-divider />

      <v-virtual-scroll
        :items="shoppedWatches"
        item-height="66"
        height="calc(100vh - 200px)"
      >
        <template v-slot:default="{ item: watch }">
          <v-list-item>
            <v-list-item-avatar>
              <v-img :src="imageSrc(watch)" />
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title style="overflow: visible">
                {{ watch.id }}
                <v-btn
                  :href="watchLink(watch)"
                  target="_blank"
                  class="mt-n1"
                  small
                  icon
                >
                  <v-icon small>
                    mdi-link-variant
                  </v-icon>
                </v-btn>
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ watch.brand }}
              </v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action>
              <v-btn
                icon
                @click="removeWatch(watch)"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>

          <v-divider />
        </template>
      </v-virtual-scroll>

      <v-row justify="center">
        <v-col
          cols="auto"
          class="mt-6"
        >
          <v-btn
            :disabled="shoppedWatchesCount === 0"
            color="primary"
            rounded
            @click="exportCSV"
          >
            Download CSV
          </v-btn>
        </v-col>
        <v-col
          cols="auto"
          class="mt-6"
        >
          <v-btn
            :disabled="shoppedWatchesCount === 0"
            color="error"
            rounded
            @click="clearWatches"
          >
            Clear all
          </v-btn>
        </v-col>
      </v-row>
    </v-navigation-drawer>
  </v-app>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex';

  export default {
    data() {
      return {
        drawer: false,
      };
    },

    computed: {
      ...mapGetters({
        shoppedWatches: 'watches',
      }),

      shoppedWatchesCount() {
        return (this.shoppedWatches?.length ?? 0);
      },

      shoppedWatchesCountStr() {
        return this.shoppedWatchesCount.toString();
      },
    },

    methods: {
      ...mapMutations([
        'clearWatches',
        'removeWatch',
      ]),

      imageSrc(watch) {
        const imageLinkPath = watch.images[0];
        return 'http://www.gowatch2000.net' + imageLinkPath;
      },

      watchLink({ link }) {
        return `http://www.gowatch2000.net${link}`;
      },

      exportCSV() {
        const watches = this.shoppedWatches.map(v => ([v.id, this.watchLink(v)]));

        const csvContent = 'data:text/csv;charset=utf-8,ref;link\r\n' +
          watches.map(v => v.join(';')).join('\r\n');

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'watches.csv');
        document.body.appendChild(link);

        link.click();
      },
    },

    head() {
      return {
        title: 'Go Watch UI',
      };
    },
  };
</script>

<style lang="scss" scoped>
  .main-content {
    margin-top: 80px;
  }
</style>
