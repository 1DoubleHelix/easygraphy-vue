<template>
  <div class="main-container">
    <el-tabs v-model="activeTab" @tab-change="handleTabChange" type="card">
      <el-tab-pane label="文章" name="blog">
        <div class="blog-list">
          <div v-for="(blog, index) in listInfo">
            <el-card>
              <div class="header">
                <span>{{ blog.title }}</span>
                <el-popconfirm
                  title="确认取消?"
                  confirm-button-text="确认"
                  cancel-button-text="取消"
                  @confirm="deleteFavorite(blog.id)"
                >
                  <template #reference>
                    <el-button>取消收藏</el-button>
                  </template>
                </el-popconfirm>
              </div>
            </el-card>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="相机" name="camera">
        <div class="device-list">
          <div v-for="(camera, index) in listInfo" class="device">
            <span>
              <el-image
                class="logo"
                :src="`/src/assets/logo/${camera.brand}.png`"
                fit="cover"
              />
            </span>
            <span @click="toDetail('camera', camera.camera_id)" class="name">
              {{ camera.brand + " " + camera.name }}
            </span>
            <el-popconfirm
              title="确认取消?"
              confirm-button-text="确认"
              cancel-button-text="取消"
              @confirm="deleteFavorite(camera.id)"
            >
              <template #reference>
                <el-button>取消收藏</el-button>
              </template>
            </el-popconfirm>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="镜头" name="lens">
        <div class="device-list">
          <div v-for="(lens, index) in listInfo" class="device">
            <span>
              <el-image
                class="logo"
                :src="`/src/assets/logo/${lens.brand}.png`"
                fit="cover"
              />
            </span>
            <span @click="toDetail('lens', lens.lens_id)" class="name">
              {{ lens.brand + " " + lens.name }}
            </span>
            <el-popconfirm
              title="确认取消?"
              confirm-button-text="确认"
              cancel-button-text="取消"
              @confirm="deleteFavorite(lens.id)"
            >
              <template #reference>
                <el-button>取消收藏</el-button>
              </template>
            </el-popconfirm>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="组合" name="combine">
        <div class="combine-list">
          <div v-for="(combine, index) in listInfo">
            <el-card>
              <div class="header">
                <span @click="toDetail('combine', combine.combine_id)">{{
                  combine.title
                }}</span>
                <el-popconfirm
                  title="确认取消?"
                  confirm-button-text="确认"
                  cancel-button-text="取消"
                  @confirm="deleteFavorite(combine.id)"
                >
                  <template #reference>
                    <el-button>取消收藏</el-button>
                  </template>
                </el-popconfirm>
              </div>
            </el-card>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="pageInfo.count"
      :page-size="pageInfo.pageSize"
      v-model:current-page="pageInfo.page"
      @update:current-page="loadInfo"
    />
  </div>
</template>

<script setup>
import { ref, reactive, inject, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import RichTextEditor from "../../components/RichTextEditor.vue";
import * as api from "../../api/index.js";
import { userStore } from "../../stores/userStore.js";

// 使用 moment 时间戳格式化
import moment from "moment";
import momentCN from "../../utils/monentCN";
import { ElMessage } from "element-plus";
const store = userStore();

moment.locale("zh-cn", momentCN);

const router = useRouter();
const route = useRoute();

onMounted(() => {
  // loadBlog();
  loadInfo();
});

const activeTab = ref("blog");
const listInfo = ref({});

// 分页参数
const pageInfo = reactive({
  page: 1,
  pageSize: 5,
  count: 0,
});

// tab切换 重新加载数据
const handleTabChange = () => {
  pageInfo.page = 1;
  loadInfo();
};

// 加载页面数据
const loadInfo = async () => {
  let res = await api.favoriteList({
    page: pageInfo.page,
    pageSize: pageInfo.pageSize,
    kind: activeTab.value,
  });
  let rows = res.data.rows;
  for (let row of rows) {
    row.createTime = moment(row.createTime).format("YYYY-MM-DD HH:mm:ss");
  }
  listInfo.value = rows;
  pageInfo.count = res.data.count;
};

// 取消收藏
const deleteFavorite = async (id) => {
  let res = await api.favoriteDelete(id);
  if (res.code === 200) {
    ElMessage.success("取消收藏成功");
    loadInfo();
  } else {
    ElMessage.error("取消收藏失败");
  }
};

// 跳转详情页
const toDetail = (kind, id) => {
  switch (kind) {
    case "camera":
      router.push({ path: "/devices/camera", query: { id } });
      break;
    case "lens":
      router.push({ path: "/devices/lens", query: { id } });
      break;
    case "combine":
      router.push({ path: "/recommend/detail", query: { id } });
      break;
    case "camera":
      router.push({ path: "/devices/camera", query: { id } });
      break;
  }
};
</script>

<style lang="scss" scoped>
.main-container {
  width: 100%;
  background-color: #fff;
  .device-list {
    .device {
      margin-top: 10px;
      height: 50px;
      border: #e4e7ed 1px solid;
      border-radius: 5px;

      display: flex;
      align-items: center;
      cursor: pointer;
      .logo {
        height: 40px;
        margin-left: 10px;
        margin-top: 6px;
      }
      .name {
        margin-left: 10px;
        font-size: 16px;
        color: #333;
      }
      .el-button {
        width: 80px;
        margin-left: auto;
        margin-right: 20px;
      }
    }
  }
}
</style>
