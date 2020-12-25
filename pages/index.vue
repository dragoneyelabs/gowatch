<template>
  <v-container>
    <v-row class="search-form">
      <v-col
        v-for="(input, i) in formInputs"
        :key="i"
        cols="12"
        sm="6"
        md="4"
      >
        <v-autocomplete
          :value="input.value"
          :items="input.items"
          :label="input.label"
          deletable-chips
          hide-details
          small-chips
          clearable
          multiple
          outlined
          dense
          @input="input.input"
        />
      </v-col>
    </v-row>

    <v-row
      class="mt-n2"
      no-gutters
    >
      <v-col>
        <v-switch
          v-model="showInfo"
          label="Show info"
        />
      </v-col>
    </v-row>

    <section class="watches-container">
      <v-card
        v-for="(watch, i) in watchesPaginated"
        :key="i"
        class="watch-card"
        min-width="280"
        max-width="360"
        elevation="8"
      >
        <v-carousel
          height="240"
          hide-delimiters
          :show-arrows="watch.images.length > 1"
          continuous
        >
          <v-carousel-item
            v-for="(image, j) in watch.images"
            :key="j"
          >
            <v-img
              class="clickable"
              aspect-ratio="1.5"
              :src="imageSrc(image)"
              @click="openImagesDialog(watch)"
            />
          </v-carousel-item>
        </v-carousel>

        <v-card-text
          style="position: relative"
          class="ma-0 pa-0"
        >
          <v-btn
            :color="watchCartIconColor(watch)"
            absolute
            right
            top
            fab
            @click="toggleWatch(watch)"
          >
            <v-icon color="white">
              {{ watchCartIcon(watch) }}
            </v-icon>
          </v-btn>
        </v-card-text>

        <v-card-subtitle class="pb-0 caption">
          {{ watch.brand }} <span v-if="watch.subBrand">- {{ watch.subBrand }}</span>
        </v-card-subtitle>

        <v-card-title class="pt-0">
          {{ watch.id }}
          <v-btn
            :href="watchLink(watch)"
            target="_blank"
            class="ml-2"
            small
            icon
          >
            <v-icon small>
              mdi-link-variant
            </v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text
          v-if="showInfo"
          class="info-list caption"
        >
          <div
            v-for="(data, j) in watchInfo(watch)"
            :key="j"
            class="info-item"
          >
            <v-icon small>
              {{ data.icon }}
            </v-icon> {{ data.value }}
          </div>
        </v-card-text>
      </v-card>
    </section>

    <section class="mt-10">
      <v-pagination
        v-model="page"
        :length="pages"
        total-visible="7"
      />
    </section>

    <v-dialog
      v-model="dialog"
      max-width="90%"
    >
      <v-card>
        <v-card-text class="pa-0">
          <v-carousel
            height="auto"
            :show-arrows="dialogImages.length > 1"
            hide-delimiters
            continuous
          >
            <v-carousel-item
              v-for="(image, j) in dialogImages"
              :key="j"
            >
              <v-img
                :src="imageSrc(image)"
              />
            </v-carousel-item>
          </v-carousel>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn
            text
            @click="dialog = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
  import _ from 'lodash';
  import { mapGetters, mapMutations } from 'vuex';

  const watchesData = require('static/watches.json');

  export default {
    data() {
      return {
        dialog: false,
        dialogImages: [],
        page: 1,
        pageSize: 60,
        showInfo: false,
        selectedBrands: [],
        selectedDiameters: [],
        selectedColors: [],
        selectedCases: [],
        selectedStraps: [],
        selectedMovements: [],
      };
    },

    computed: {
      ...mapGetters({
        shoppedWatches: 'watches',
      }),

      shoppedWatchesIDs() {
        return this.shoppedWatches.map(v => v.id);
      },

      selected() {
        return [
          ...this.selectedBrands,
          ...this.selectedDiameters,
          ...this.selectedColors,
          ...this.selectedCases,
          ...this.selectedStraps,
          ...this.selectedMovements,
        ];
      },

      formInputs() {
        return [
          {
            label: 'Brand',
            value: this.selectedBrands,
            input: (v) => { this.selectedBrands = v; },
            items: this.brands,
          },
          {
            label: 'Diameter',
            value: this.selectedDiameters,
            input: (v) => { this.selectedDiameters = v; },
            items: this.diameters,
          },
          {
            label: 'Dial color',
            value: this.selectedColors,
            input: (v) => { this.selectedColors = v; },
            items: this.dialColors,
          },
          {
            label: 'Case material',
            value: this.selectedCases,
            input: (v) => { this.selectedCases = v; },
            items: this.cases,
          },
          {
            label: 'Bracelet material',
            value: this.selectedStraps,
            input: (v) => { this.selectedStraps = v; },
            items: this.straps,
          },
          {
            label: 'Movement',
            value: this.selectedMovements,
            input: (v) => { this.selectedMovements = v; },
            items: this.movements,
          },
        ];
      },

      pages() {
        return Math.ceil(this.watches.length / this.pageSize);
      },

      watches() {
        return watchesData.filter((v) => {
          return (
            !this.selectedBrands.length &&
            !this.selectedDiameters.length &&
            !this.selectedColors.length &&
            !this.selectedCases.length &&
            !this.selectedStraps.length &&
            !this.selectedMovements.length
          ) ||
            (
              (!this.selectedBrands.length || this.selectedBrands.includes(v.brand)) &&
              (!this.selectedDiameters.length || this.selectedDiameters.includes(v.info.diameter)) &&
              (!this.selectedColors.length || this.selectedColors.includes(_.capitalize(v.info.dialColor))) &&
              (!this.selectedCases.length || this.selectedCases.includes(_.capitalize(v.info.case))) &&
              (!this.selectedStraps.length || this.selectedStraps.includes(_.capitalize(v.info.bracelet))) &&
              (!this.selectedMovements.length || this.selectedMovements.includes(_.capitalize(v.info.movement)))
            );
        });
      },

      watchesPaginated() {
        const start = (this.page - 1) * this.pageSize;
        const end = start + this.pageSize;
        return this.watches.slice(start, end);
      },

      brands() {
        return this.distinctSorted(watchesData.map(v => v.brand));
      },

      diameters() {
        return this.distinctWatchInfoParam('diameter', false);
      },

      dialColors() {
        return this.distinctWatchInfoParam('dialColor', true);
      },

      cases() {
        return this.distinctWatchInfoParam('case', true);
      },

      straps() {
        return this.distinctWatchInfoParam('bracelet', true);
      },

      movements() {
        return this.distinctWatchInfoParam('movement', true);
      },
    },

    watch: {
      selected() {
        this.page = 1;
      },

      page() {
        this.scrollToTop();
      },
    },

    methods: {
      ...mapMutations([
        'addWatch',
        'removeWatch',
      ]),

      scrollToTop() {
        window.scrollTo(0, 0);
      },

      openImagesDialog({ images }) {
        this.dialogImages = images;
        this.dialog = true;
      },

      isWatchShopped({ id }) {
        return this.shoppedWatchesIDs.includes(id);
      },

      toggleWatch(watch) {
        if (this.isWatchShopped(watch)) {
          this.removeWatch(watch);
        } else {
          this.addWatch(watch);
        }
      },

      watchCartIcon(watch) {
        return this.isWatchShopped(watch) ? 'mdi-cart-minus' : 'mdi-cart-plus';
      },

      watchCartIconColor(watch) {
        return this.isWatchShopped(watch) ? 'red' : 'primary';
      },

      distinctSorted(arr) {
        const distinct = [...new Set(arr)];
        distinct.sort();
        return distinct;
      },

      distinctWatchInfoParam(param, capitalize) {
        return this.distinctSorted(
          watchesData.filter(v => v.info[param]).map((v) => {
            return capitalize ? _.capitalize(v.info[param]) : v.info[param];
          }),
        );
      },

      imageSrc(imageLinkPath) {
        return 'http://www.gowatch2000.net' + imageLinkPath;
      },

      watchLink({ link }) {
        return `http://www.gowatch2000.net${link}`;
      },

      watchInfo(watch) {
        const info = [
          {
            value: watch.info.diameter ? `${watch.info.diameter} mm` : '',
            icon: 'mdi-diameter-variant',
          },
          {
            value: watch.info.thickness ? `${watch.info.thickness} mm` : '',
            icon: 'mdi-arrow-collapse-vertical',
          },
          {
            value: watch.info.width ? `${watch.info.width} mm` : '',
            icon: 'mdi-arrow-expand-horizontal',
          },
          {
            value: watch.info.weight ? `${watch.info.weight} kg` : '',
            icon: 'mdi-weight',
          },
          {
            value: _.capitalize(watch.info.dialColor),
            icon: 'mdi-palette',
          },
          {
            value: _.capitalize(watch.info.movement),
            icon: 'mdi-cog',
          },
          {
            value: _.capitalize(watch.info.case),
            icon: 'mdi-clock-time-three-outline',
          },
          {
            value: _.capitalize(watch.info.bracelet),
            icon: 'mdi-road',
          },
        ];

        return info.filter(v => v.value);
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
.clickable {
  cursor: pointer;
}

.watches-container {
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
}

.watch-card {
  flex: 1 0 280px;
  margin: 8px;
}

.info-list {
  display: flex;
  flex-flow: row wrap;
}

.info-item {
  flex: 1 1 33%;
}
</style>
