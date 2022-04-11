<template>
  <el-row>
    <el-card>
      <section>
        <span class="find-training">{{ $t('m.Search_Training') }}</span>
        <vxe-input
            v-model="query.keyword"
            :placeholder="$t('m.Enter_keyword')"
            size="medium"
            style="width:230px"
            type="search"
            @keyup.enter.native="filterByChange"
            @search-click="filterByChange"
        ></vxe-input>
      </section>
      <section>
        <b class="training-category">{{ $t('m.Training_Auth') }}</b>
        <div>
          <el-tag
              :effect="query.auth ? 'plain' : 'dark'"
              class="category-item"
              size="medium"
              @click="filterByAuthType(null)"
          >{{ $t('m.All') }}
          </el-tag
          >
          <el-tag
              v-for="(key, index) in TRAINING_TYPE"
              :key="index"
              :effect="query.auth == key.name ? 'dark' : 'plain'"
              :type="key.color"
              class="category-item"
              size="medium"
              @click="filterByAuthType(key.name)"
          >{{ $t('m.Training_' + key.name) }}
          </el-tag
          >
        </div>
      </section>
      <section>
        <b class="training-category">{{ $t('m.Training_Category') }}</b>
        <div>
          <el-tag
              :style="getCategoryBlockColor(null)"
              class="category-item"
              size="medium"
              @click="filterByCategory(null)"
          >{{ $t('m.All') }}
          </el-tag
          >
          <el-tag
              v-for="(category, index) in categoryList"
              :key="index"
              :style="getCategoryBlockColor(category)"
              class="category-item"
              size="medium"
              @click="filterByCategory(category.id)"
          >{{ category.name }}
          </el-tag
          >
        </div>
      </section>
    </el-card>

    <el-card style="margin-top:2em">
      <vxe-table
          ref="trainingList"
          :data="trainingList"
          :loading="loading"
          auto-resize
          border="inner"
          stripe
          style="font-size: 14px !important;font-weight: 450 !important;"
      >
        <vxe-table-column
            :title="$t('m.Number')"
            field="rank"
            min-width="60"
            show-overflow
        >
        </vxe-table-column>
        <vxe-table-column
            :title="$t('m.Title')"
            align="center"
            field="title"
            min-width="200"
        >
          <template v-slot="{ row }"
          >
            <el-link type="primary" @click="toTraining(row.id)">{{
                row.title
              }}
            </el-link>
          </template>
        </vxe-table-column>

        <vxe-table-column
            :title="$t('m.Auth')"
            align="center"
            field="auth"
            min-width="100"
        >
          <template v-slot="{ row }">
            <el-tag :type="TRAINING_TYPE[row.auth]['color']" effect="dark">
              {{ $t('m.Training_' + row.auth) }}
            </el-tag>
          </template>
        </vxe-table-column>
        <vxe-table-column
            :title="$t('m.Category')"
            align="center"
            field="categoryName"
            min-width="130"
        >
          <template v-slot="{ row }">
            <el-tag
                :key="index"
                :style="
                'background-color: #fff;color: ' +
                  row.categoryColor +
                  ';border-color: ' +
                  row.categoryColor +
                  ';'
              "
                class="category-item"
                size="medium"
            >{{ row.categoryName }}
            </el-tag
            >
          </template>
        </vxe-table-column>
        <vxe-table-column
            :title="$t('m.Problem_Number')"
            align="center"
            field="problemCount"
            min-width="80"
        >
        </vxe-table-column>
        <vxe-table-column
            :title="$t('m.Author')"
            align="center"
            field="author"
            min-width="150"
            show-overflow
        >
          <template v-slot="{ row }"
          >
            <el-link type="info" @click="goUserHome(row.author)">{{
                row.author
              }}
            </el-link>
          </template>
        </vxe-table-column>
        <vxe-table-column
            :title="$t('m.Recent_Update')"
            align="center"
            field="gmtModified"
            min-width="160"
            show-overflow
        >
          <template v-slot="{ row }">
            {{ row.gmtModified | localtime }}
          </template>
        </vxe-table-column>
      </vxe-table>
    </el-card>
    <Pagination
        :current.sync="currentPage"
        :pageSize="limit"
        :total="total"
        @on-change="getTrainingList"
    ></Pagination>
  </el-row>
</template>

<script>
import api from '@/common/api';
import utils from '@/common/utils';
import {TRAINING_TYPE} from '@/common/constants';
import myMessage from '@/common/message';
import {mapGetters} from 'vuex';

const Pagination = () => import('@/components/oj/common/Pagination');
export default {
  name: 'TrainingList',
  components: {
    Pagination,
  },
  data() {
    return {
      query: {
        keyword: '',
        categoryId: null,
        auth: null,
      },
      total: 0,
      currentPage: 1,
      limit: 15,
      categoryList: [],
      trainingList: [],
      TRAINING_TYPE: {},
      loading: false,
    };
  },
  created() {
    this.TRAINING_TYPE = Object.assign({}, TRAINING_TYPE);
    this.getTrainingCategoryList();
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      let route = this.$route.query;
      this.query.keyword = route.keyword || '';
      this.currentPage = parseInt(route.currentPage) || 1;
      this.query.categoryId = route.categoryId || null;
      this.query.auth = route.auth || null;
      this.getTrainingList(1);
    },
    filterByCategory(categoryId) {
      this.query.categoryId = categoryId;
      this.filterByChange();
    },

    filterByAuthType(auth) {
      this.query.auth = auth;
      this.filterByChange();
    },

    filterByChange() {
      let query = Object.assign({}, this.query);
      query.currentPage = this.currentPage;
      this.$router.push({
        path: '/training',
        query: utils.filterEmptyValue(query),
      });
    },
    getTrainingList(page) {
      this.loading = true;
      let query = Object.assign({}, this.query);
      api.getTrainingList(page, this.limit, query).then(
          (res) => {
            this.trainingList = res.data.data.records;
            this.total = res.data.data.total;
            this.loading = false;
          },
          (err) => {
            this.loading = false;
          }
      );
    },
    getTrainingCategoryList() {
      api.getTrainingCategoryList().then((res) => {
        this.categoryList = res.data.data;
      });
    },

    toTraining(trainingID) {
      if (!this.isAuthenticated) {
        myMessage.warning(this.$i18n.t('m.Please_login_first'));
        this.$store.dispatch('changeModalStatus', {visible: true});
      } else {
        this.$router.push({
          name: 'TrainingDetails',
          params: {trainingID: trainingID},
        });
      }
    },
    goUserHome(username) {
      this.$router.push({
        path: '/user-home',
        query: {username},
      });
    },

    getCategoryBlockColor(category) {
      if (category == null) {
        if (!this.query.categoryId) {
          return 'color: #fff;background-color: #409EFF;background-color: #409EFF';
        } else {
          return 'background-color: #fff;color: #409EFF;border-color: #409EFF';
        }
      }

      if (category.id == this.query.categoryId) {
        return (
            'color: #fff;background-color: ' +
            category.color +
            ';background-color: ' +
            category.color +
            ';'
        );
      } else {
        return (
            'background-color: #fff;color: ' +
            category.color +
            ';border-color: ' +
            category.color +
            ';'
        );
      }
    },
  },
  computed: {
    ...mapGetters(['isAuthenticated']),
  },
  watch: {
    $route(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.init();
      }
    },
  },
};
</script>

<style scoped>
section {
  display: flex;
  min-height: 3em;
  margin-bottom: 1em;
  align-items: center;
}

.find-training {
  margin-right: 1em;
  white-space: nowrap;
  font-size: 1.7em;
  margin-top: 0;
  font-family: inherit;
  font-weight: bold;
  line-height: 1.2;
  color: inherit;
}

.training-category {
  margin-right: 1.5em;
  font-weight: bolder;
  white-space: nowrap;
  font-size: 16px;
  margin-top: 8px;
}

.category-item {
  margin-right: 1em;
  margin-top: 0.5em;
  font-size: 14px;
}

.category-item:hover {
  cursor: pointer;
}
</style>
