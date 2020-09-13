<template>
  <div class="app-container">
    <div class="toolbar">
      <el-select v-model="selectCheckType" placeholder="请选择检测类型" clearable>
        <el-option
          v-for="item in selectCheckTypes"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select v-model="selectRegion" placeholder="请选择地区" clearable>
        <el-option
          v-for="item in selectRegions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-input v-model="search" prefix-icon="el-icon-search" placeholder="请输入搜索内容" />
      <el-button
        type="primary"
        size="medium"
        icon="el-icon-plus"
        @click="handleAdd()"
      >
        新增项目
      </el-button>
    </div>
    <div>
      <el-table
        :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
        border
        fit
        highlight-current-row
      >
        <el-table-column prop="name" label="项目名称" />
        <el-table-column label="类型">
          <template slot-scope="scope">
            <el-tag>{{ scope.row.checkTypeLabel }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="地址" />
        <el-table-column prop="regionLabel" label="地区" width="100px" />
        <el-table-column prop="regulatorLabel" label="监管机构" />
        <el-table-column prop="entrustedUnit" label="委托单位" />
        <el-table-column prop="createTime" label="创建时间" />

        <el-table-column
          prop="agreementPics"
          label="检测项目合同"
        >
          <template slot-scope="scope">
            <el-image
              v-for="(item, index) in scope.row.agreementPics"
              :key="index"
              alt="检测项目合同"
              class="pic"
              :src="item.url"
              fit="fill"
              :preview-src-list="scope.row.agreementPics.map(item => item.url)"
            />
          </template>
        </el-table-column>

        <el-table-column
          prop="entrustmentPics"
          label="委托协议书"
        >
          <template slot-scope="scope">
            <el-image
              v-for="(item, index) in scope.row.entrustmentPics"
              :key="index"
              alt="委托协议书"
              class="pic"
              :src="item.url"
              fit="fill"
              :preview-src-list="scope.row.entrustmentPics.map(item => item.url)"
            />
          </template>
        </el-table-column>

        <el-table-column>
          <template slot-scope="scope">
            <el-button
              size="small"
              type="success"
              icon="el-icon-s-management"
              style="margin: 5px"
              @click="handleOpenEntity(scope.$index, scope.row)"
            >单体</el-button>
            <el-button
              size="small"
              type="success"
              icon="el-icon-s-order"
              style="margin: 5px"
              @click="handleOpenCheckPlan(scope.$index, scope.row)"
            >检测计划</el-button>
          </template>
        </el-table-column>
        <el-table-column>
          <template slot-scope="scope">
            <el-button
              size="small"
              type="primary"
              icon="el-icon-edit"
              style="margin: 5px"
              @click="handleEdit(scope.$index, scope.row)"
            >修改</el-button>

            <el-button
              size="small"
              type="danger"
              icon="el-icon-delete"
              style="margin: 5px"
              @click="handleDelete(scope.$index+(currentPage-1)*pageSize, scope.row, tableData)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-drawer
      :title="isAdd?'新增检测项目':'修改检测项目信息'"
      :visible.sync="drawerVisible"
      size="80%"
      @open="mapInit"
      @closed="resetForm('projectForm')"
    >
      <div class="drawer-content">
        <el-form ref="projectForm" :model="project" :rules="projectInfoRules" label-width="120px">
          <el-row>
            <el-col :span="8">
              <el-form-item label="项目类型" prop="checkType">
                <el-select v-model="project.checkType" placeholder="请选择检测类型" clearable>
                  <el-option
                    v-for="item in checkTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="项目名称" prop="name">
                <el-input v-model="project.name" placeholder="请输入项目名称" style="width: 100%" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="项目地址" prop="address">
                <el-input v-model="project.address" placeholder="请输入项目地址" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="8">
              <el-form-item label="地区" prop="region">
                <el-select v-model="project.region" placeholder="请选择" @change="handleRegionChange">
                  <el-option
                    v-for="item in regionOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="监管机构">
                <el-select v-model="project.regulator" disabled>
                  <el-option
                    v-for="item in regulatorOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="委托单位" prop="entrustedUnit">
                <el-input v-model="project.entrustedUnit" placeholder="请输入委托单位" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="8">
              <el-form-item label="坐标" prop="coordinate">
                <el-input v-model="project.coordinate" placeholder="在最下方地图选择或者直接输入" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="创建时间" prop="createTime">
                <el-date-picker
                  v-model="project.createTime"
                  type="datetime"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="请选择创建时间"
                  @change="changeDate"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="8">
              <el-form-item label="检测项目合同">
                <el-upload
                  ref="uploadAgreement"
                  action=""
                  :http-request="uploadAgreementPic"
                  multiple
                  accept="image/jpeg,image/jpeg,image/png"
                  :auto-upload="false"
                  :on-remove="handleRemoveAgreementPic"
                  :file-list="project.agreementPics"
                  list-type="picture"
                >
                  <el-button size="small" type="primary" icon="el-icon-upload">点击上传</el-button>
                  <div slot="tip" class="el-upload__tip">只能上传jpg/jpeg/png文件</div>
                </el-upload>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="委托协议书">
                <el-upload
                  ref="uploadEntrustment"
                  action=""
                  :http-request="uploadEntrustmentPic"
                  multiple
                  accept="image/jpeg,image/jpeg,image/png"
                  :auto-upload="false"
                  :on-remove="handleRemoveEntrustmentPic"
                  :file-list="project.entrustmentPics"
                  list-type="picture"
                >
                  <el-button size="small" type="primary" icon="el-icon-upload">点击上传</el-button>
                  <div slot="tip" class="el-upload__tip">只能上传jpg/jpeg/png文件</div>
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="8">
              <el-input
                id="tipInput"
                v-model="keyword"
                prefix-icon="el-icon-search"
                placeholder="请输入关键字在地图上搜索"
              />
            </el-col>
          </el-row>

          <div id="container" class="map-div" />

        </el-form>
        <div class="drawer-footer">
          <el-button @click="drawerVisible = false">取 消</el-button>
          <el-button type="primary" :loading="loading" @click="handleSubmit()">{{ loading ? '提交中 ...' : '提 交' }}</el-button>
        </div>
      </div>
    </el-drawer>

    <el-drawer
      :title="`${project.name}(${project.checkTypeLabel})`"
      :visible.sync="drawerVisibleCheckPlan"
      size="80%"
      @open="initCheckPlan"
    >
      <div class="drawer-content">
        <div class="toolbar">
          <el-button
            type="primary"
            size="medium"
            icon="el-icon-plus"
            @click="handleAddCheckPlan()"
          >
            新增检测计划
          </el-button>
        </div>
        <div>
          <el-table
            :data="checkPlanList.slice((planCurrentPage-1)*planPageSize,planCurrentPage*planPageSize)"
            border
            fit
            highlight-current-row
          >
            <el-table-column prop="name" label="名称" />
            <el-table-column prop="planCheckDate" label="计划检测日期" />
            <el-table-column>
              <template slot-scope="scope">
                <el-button
                  size="small"
                  type="primary"
                  icon="el-icon-edit"
                  style="margin: 5px"
                  @click="handleModifyCheckPlan(scope.$index, scope.row)"
                >变更</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div>
        </div>
      </div>
    </el-drawer>

    <el-drawer
      :title="isAddCheckPlan?'新增检测计划':'变更检测计划'"
      :visible.sync="drawerVisibleCheckPlanForm"
      size="50%"
      @closed="resetForm('checkPlanForm')"
      class="plan-table"
    >
      <h3 style="text-align:center;padding-bottom:10px">防雷装置现场检测计划表</h3>
      <div class="drawer-content">
        <el-form ref="checkPlanForm" style="border:1px solid #6e6a6a;padding:5px" :model="checkPlan" label-width="100px">

          <el-row>
            <el-col :span="12">
              <el-form-item label="计划名称" style="border-bottom:1px solid #6e6a6a;">
                <el-input v-model="dateToday" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="计划检测日期" prop="planCheckDate" style="border-bottom:1px solid #6e6a6a;">
                <el-date-picker
                  v-model="checkPlan.planCheckDate"
                  type="date"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  placeholder="请选择计划检测日期"
                  @change="changeCheckPlanDate"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="检测人员">
            <el-checkbox-group v-model="checkedUsers" @change="changechecker">
              <el-checkbox
                v-for="(user, index) in companyCheckUsers"
                :key="index"
                :label="user.id"
              >
                {{ user.name }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="检测设备" required>
            <el-checkbox-group v-model="checkedEquipments">
              <el-checkbox
                v-for="(equipment, index) in companyCheckEquipments"
                :key="index"
                :label="equipment.id"
              >
                {{ equipment.name }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <div style="line-height: 30px;border-bottom:1px solid #000">一、防雷技术服务机构信息</div>
          <el-row style="height:40px;border-bottom:1px solid #000">
            <el-col :span="10">
              <el-form-item label="机构名称">
                <el-input v-model="companyInfo.name" disabled placeholder="请输入机构名称" />
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="现场负责人">
                <el-input v-model="companyInfo.contact" disabled placeholder="请输入现场负责人" />
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="联系电话">
                <el-input v-model="companyInfo.phone" disabled placeholder="请输入联系电话" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="检测人员">
            <el-checkbox-group v-model="checkedUsers" @change="changechecker">
              <el-checkbox
                v-for="(user, index) in companyCheckUsers"
                :key="index"
                :label="user.id"
              >
                {{ user.name }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="检测设备" required>
            <el-checkbox-group v-model="checkedEquipments">
              <el-checkbox
                v-for="(equipment, index) in companyCheckEquipments"
                :key="index"
                :label="equipment.id"
              >
                {{ equipment.name }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-row>
            <el-col :span="24">
              <el-form-item label="检测类别">
                <el-checkbox
                  v-for="(checkType, index) in checkTypeOptions"
                  :key="index"
                  :label="checkType.id"
                  :checked="checkType.label === project.checkTypeLabel"
                  disabled="true"
                >
                  {{ checkType.label }}
                </el-checkbox>
              </el-form-item>
            </el-col>
          </el-row>
          <div>二、防雷技术服务活动信息</div>
          <el-row style="margin-top:20px">
            <el-col :span="24">
              <el-form-item label="检测对象名称" prop="entrustedUnit">
                <el-input v-model="project.name" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="检测对象地址" prop="entrustedUnit">
                <el-input v-model="project.address" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="检测单体" required>
            <el-table ref="checkEntityTable" :data="entityList">
              <el-table-column
                v-if="isAddCheckPlan"
                type="selection"
                width="55"
              />
              <el-table-column label="名称" prop="name" />
              <el-table-column label="检测类型" prop="checkTypeLabel" />
              <el-table-column label="建筑物防雷类别" prop="levelLabel" />
            </el-table>
          </el-form-item>
        </el-form>
        <div class="drawer-footer">
          <el-button @click="drawerVisibleCheckPlanForm = false">取 消</el-button>
          <el-button type="primary" :loading="checkPlanFormLoading" @click="handleCheckPlanSubmit()">{{ checkPlanFormLoading ? '提交中 ...' : '提 交' }}</el-button>
        </div>
      </div>
    </el-drawer>

    <el-drawer
      :title="'检测报告提交'"
      :visible.sync="drawerVisibleReportForm"
      size="50%"
    >
      <div class="drawer-content">
        <el-form ref="checkPlanForm" :model="checkPlanEntitie" label-width="120px">
          <el-form-item label="名称">
            <el-input v-model="checkPlanEntitie.name" disabled />
          </el-form-item>
          <el-form-item label="检测报告">
            <el-upload
              action=""
              :http-request="handleUploadReport"
              auto-upload="false"
              limit="1"
            >
              <el-button
                size="medium"
                type="primary"
                style="margin: 5px"
                icon="el-icon-upload"
              >上传</el-button>
            </el-upload>
          </el-form-item>
        </el-form>
        <div class="drawer-footer">
          <el-button @click="drawerVisible = false">取 消</el-button>
          <el-button type="primary" :loading="loading" @click="handleSubmitReport()">{{ loading ? '提交中 ...' : '提 交' }}</el-button>
        </div>
      </div>
    </el-drawer>

    <el-drawer
      :title="`${project.name}(${project.checkTypeLabel})`"
      :visible.sync="drawerVisibleEntity"
      size="80%"
      @open="initEntity"
    >
      <div class="drawer-content">
        <div class="toolbar">
          <el-button
            type="primary"
            size="medium"
            icon="el-icon-plus"
            @click="handleAddEntity()"
          >
            定义单体
          </el-button>
        </div>
        <div>
          <el-table
            :data="entityList.slice((entityCurrentPage-1)*entityPageSize,entityCurrentPage*entityPageSize)"
            border
            fit
            highlight-current-row
          >
            <el-table-column prop="name" label="名称" />
            <el-table-column
              label="检测类型"
              :filters="checkTypeFilters"
              :filter-method="filterHandler"
            >
              <template slot-scope="scope">
                <el-tag>{{ scope.row.checkTypeLabel }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="建筑物防雷类别" :filters="levelFilters" :filter-method="filterHandler">
              <template slot-scope="scope">
                <el-tag type="danger">{{ scope.row.levelLabel }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="编辑">
              <template slot-scope="scope">
                <el-button
                  size="small"
                  type="primary"
                  style="margin: 5px"
                  icon="el-icon-edit"
                  @click="handleModifyEntity(scope.$index, scope.row)"
                >修改</el-button>
              </template>
            </el-table-column>
            <el-table-column label="提交">
              <template slot-scope="scope">
                <el-upload
                  ref="uploadCheckEntityReportList"
                  action=""
                  :http-request="handleSubmitReport"
                  :disabled="(scope.row.checkNow)=== 0 ? true : false"
                  limit="1"
                />

                <el-upload
                  ref="uploadCheckEntityRecordList"
                  action=""
                  :http-request="handleSubmitRecord"
                  :disabled="(scope.row.checkNow)=== 0 ? true : false"
                  limit="1"
                >
                  <el-button
                    size="small"
                    type="primary"
                    style="margin: 5px"
                    icon="el-icon-upload"
                    :disabled="(scope.row.checkNow)=== 0 ? true : false"
                    @click="openReportAndRecord(scope.$index, scope.row)"
                  >原始记录</el-button>
                </el-upload>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div>
        </div>
      </div>
    </el-drawer>

    <el-drawer
      :title="isAddEntity?'新增单体':'修改单体信息'"
      :visible.sync="drawerVisibleEntityForm"
      size="30%"
      @closed="resetForm('entityForm')"
    >
      <div class="drawer-content">
        <el-form ref="entityForm" :model="entity" :rules="entityRules" label-width="120px">
          <el-form-item label="单体名称" prop="name">
            <el-input v-model="entity.name" placeholder="请输入单体名称" />
          </el-form-item>
          <el-form-item label="检测类型" prop="checkType">
            <el-select v-model="entity.checkType" placeholder="请选择检测类型" clearable>
              <el-option
                v-for="item in entityCheckTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="防雷等级" prop="level">
            <el-select v-model="entity.level" placeholder="请选择防雷等级" clearable>
              <el-option
                v-for="item in entityLevelOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <div class="drawer-footer">
          <el-button @click="drawerVisibleEntityForm = false">取 消</el-button>
          <el-button type="primary" :loading="entityFormloading" @click="handleEntitySubmit()">{{ entityFormloading ? '提交中 ...' : '提 交' }}</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>

export default {
  name: 'Index',
  components: {

  },
  data() {
    return {
      search: '',
      selectCheckType: '',
      selectCheckTypes: [],
      selectRegion: '',
      selectRegions: [],
      companyInfo: {},
      list: [],
      data: [],
      pageSize: 5,
      pageSizes: [5, 10, 15],
      currentPage: 1,
      isAdd: false,
      drawerVisible: false,
      project: {},
      checkTypeOptions: [],
      regionOptions: [],
      regulatorOptions: [],
      keyword: '',
      loading: false,
      agreementPics: [],
      entrustmentPics: [],
      projectInfoRules: {
        name: [
          { required: true, message: '请输入项目名称', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入项目地址', trigger: 'blur' }
        ],
        checkType: [
          { required: true, message: '请选择检测类型', trigger: 'blur' }
        ],
        region: [
          { required: true, message: '请选择地区', trigger: 'blur' }
        ],
        createTime: [
          { required: true, message: '请选择创建时间', trigger: 'blur' }
        ],
        entrustedUnit: [
          { required: true, message: '请输入委托单位', trigger: 'blur' }
        ],
        coordinate: [
          { required: true, message: '坐标不可为空', trigger: 'blur' }
        ]
      },

      drawerVisibleEntity: false,
      entityList: [],
      checkTypeFilters: [],
      levelFilters: [],
      isAddEntity: false,
      drawerVisibleEntityForm: false,
      entity: {},
      entityCheckTypeOptions: [],
      entityLevelOptions: [],
      entityFormloading: false,
      companyCheckUsers: [],
      checkedUsers: [],
      tableUsers: '',
      tableUsersArray: [],
      entityPageSize: 5,
      entityPageSizes: [5, 10, 15],
      entityCurrentPage: 1,
      entityRules: {
        name: [
          { required: true, message: '请输入单体名称', trigger: 'blur' }
        ],
        checkType: [
          { required: true, message: '请选择活动区域', trigger: 'blur' }
        ],
        level: [
          { required: true, message: '请选择防雷等级', trigger: 'blur' }
        ]
      },

      companyCheckEquipments: [],
      checkedEquipments: [],

      drawerVisibleCheckPlan: false,
      checkPlanList: [],
      isAddCheckPlan: false,
      checkPlan: {},
      drawerVisibleCheckPlanForm: false,
      checkPlanFormLoading: false,
      planPageSize: 5,
      planPageSizes: [5, 10, 15],
      planCurrentPage: 1,
      checkPlanRules: {
        name: [
          { required: true, message: '请输入计划名称', trigger: 'blur' }
        ],
        planCheckDate: [
          { required: true, message: '请选择计划检测日期', trigger: 'blur' }
        ]
      },

      drawerVisibleReportForm: false,
      checkPlanEntitie: {},
      reportFormLoading: false,
      reportEntity: {},
      dateToday: ''
    }
  },
  computed: {
    tableData() {
      const search = this.search
      if (search || this.selectCheckType || this.selectRegion) {
        return this.list.filter(data => {
          return Object.keys(data).some(key => {
            return String(data[key]).toLowerCase().indexOf(search) > -1 && String(data[key]).toLowerCase().indexOf(this.selectCheckType) > -1 && String(data[key]).toLowerCase().indexOf(this.selectRegion) > -1
          })
        })
      }
      return this.list
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
    },
    handlePageChange(currentPage, pageSize) {
      this.currentPage = currentPage
      this.pageSize = pageSize
    },
    handleEntityPageChange(currentPage, pageSize) {
      this.entityCurrentPage = currentPage
      this.entityPageSize = pageSize
    },
    handlePlanPageChange(currentPage, pageSize) {
      this.planCurrentPage = currentPage
      this.planPageSize = pageSize
    },
    handleAdd() {
      this.isAdd = true
      this.drawerVisibleCheckPlanForm = true
      this.project = {}
    },
    handleEdit(index, row) {
      this.isAdd = false
      this.drawerVisible = true
      this.project = row
    },
    handleRegionChange(value) {
      this.project.regulator = this.regulatorOptions.find((item) => item.value === value).value
    },
    changeDate(val) {
      this.project.expiredDate = val
    },
    handleSubmit() {
      this.$refs.projectForm.validate((valid) => {
        if (!valid) {
          return false
        } else {
          this.loading = true
          this.$refs.uploadAgreement.submit()
          this.$refs.uploadEntrustment.submit()

          const formData = new FormData()
          formData.append('name', this.project.name)
          formData.append('checkType', this.project.checkType)
          formData.append('address', this.project.address)
          formData.append('region', this.project.region)
          formData.append('regulator', this.project.regulator)
          formData.append('coordinate', this.project.coordinate)
          formData.append('createTime', this.project.createTime)
          formData.append('companyId', this.companyId)
          formData.append('entrustedUnit', this.project.entrustedUnit)

          this.agreementPics.forEach((item) => {
            formData.append('agreementPics', item, item.name)
          })

          this.entrustmentPics.forEach((item) => {
            formData.append('entrustmentPics', item, item.name)
          })

        }
      })
    },
    uploadAgreementPic(raw) {
      this.agreementPics.push(raw.file)
    },
    uploadEntrustmentPic(raw) {
      this.entrustmentPics.push(raw.file)
    },
    handleRemoveAgreementPic(file) {
      if (file.status === 'ready') {
        return
      }
      const formData = new FormData()
      formData.append('companyId', this.companyId)
      formData.append('projectId', this.project.id)
      formData.append('name', file.name)
      formData.append('url', file.url)
      formData.append('type', 'Agreement')

      this.project.agreementPics.splice(this.project.agreementPics.findIndex(item => item.url === file.url), 1)
    },
    handleRemoveEntrustmentPic(file) {
      if (file.status === 'ready') {
        return
      }
      const formData = new FormData()
      formData.append('companyId', this.companyId)
      formData.append('projectId', this.project.id)
      formData.append('name', file.name)
      formData.append('url', file.url)
      formData.append('type', 'Entrustment')

      this.project.entrustmentPics.splice(this.project.entrustmentPics.findIndex(item => item.url === file.url), 1)
    },
    handleOpenEntity(index, row) {
      this.project = row
      this.drawerVisibleEntity = true

      this.checkTypeFilters = []
      this.levelFilters = []

      this.selectCheckTypes.forEach((item) => {
        if (item.value === row.checkType) {
          this.entityCheckTypeOptions = item.children

          item.children.forEach((i) => {
            this.checkTypeFilters.push({
              text: i.label,
              value: i.value
            })
          })
        }
      })

    },
    filterHandler(value, row, column) {
      const property = column['property']
      return row[property] === value
    },
    handleAddEntity() {
      this.isAddEntity = true
      this.drawerVisibleEntityForm = true
      this.entity = {}
    },
    handleModifyEntity(index, row) {
      this.isAddEntity = false
      this.drawerVisibleEntityForm = true
      this.entity = row
    },
    changeCheckPlanDate(val) {
      this.checkPlan.planCheckDate = val
    },
   
    getdateToday() {
      const date = new Date()
      const yyyy = date.getFullYear()
      let mm = date.getMonth() + 1
      let dd = date.getDate()
      mm = mm < 10 ? '0' + mm : mm
      dd = dd < 10 ? '0' + dd : dd
      return yyyy + '-' + mm + '-' + dd
    },
    /**
     * @description
     * 勾选检测人员时，checkbox的label绑定的是userId。由于还需要在下方检测人员的input中显示username，
     * 不能绑定同一变量，因此定义了一个数组，存放checkbox改变时的参数，即userId，
     * 再从全部的检测人员数组中遍历得到勾选的检测人员的name并转成字符串显示在input中。
     */
    changechecker(changeduser) {
      if (changeduser.length === 0) {
        this.tableUsers = ''
      } else {
        this.tableUsersArray = []
        changeduser.forEach(checkerId => {
          this.companyCheckUsers.forEach(user => {
            if (user.id === checkerId) {
              this.tableUsersArray.push(user.name)
              this.tableUsers = this.tableUsersArray.join('、')
            }
          })
        })
      }
    },
    handleCheckPlanSubmit() {
      this.$refs.checkPlanForm.validate((valid) => {
        if (!valid) {
          return false
        } else {
          if (this.checkedUsers.length === 0 || this.checkedEquipments === 0) {
            this.$message({
              type: 'warning',
              message: `请勾选检测人员和检测设备`
            })
            return false
          } else {
            this.checkPlanFormLoading = true
            const data = new FormData()
            data.append('name', this.dateToday)
            data.append('planCheckDate', this.checkPlan.planCheckDate)
            data.append('checkUsers', this.checkedUsers)
            data.append('checkEquipments', this.checkedEquipments)

            if (this.isAddCheckPlan) {
              data.append('projectId', this.project.id)
              data.append('entities', this.$refs.checkEntityTable.selection.map(item => item.id))
            } else {
              data.append('id', this.checkPlan.id)
            }
          }
        }
      })
    },
    handleModifyCheckPlan(index, row) {
      this.isAddCheckPlan = false
      this.drawerVisibleCheckPlanForm = true
      this.checkPlan = row

      this.checkedUsers = []
      this.tableUsersArray = []
      this.checkedUsers = this.checkPlan.users.map(item => item.userId)
      this.checkPlan.users.forEach(user => {
        this.tableUsersArray.push(user.name)
        this.tableUsers = this.tableUsersArray.join('、')
      })
      this.checkedEquipments = []
      this.checkedEquipments = this.checkPlan.equipments.map(item => item.equipmentId)
      this.entityList = this.checkPlan.entities
    },
    openReportAndRecord(index, row) {
      if (row.checkNow !== 0) {
        this.checkPlanEntitie = row
      } else {
        this.$message({
          type: 'warning',
          message: `尚未到检测日期，无法上传。`
        })
      }
    },
    handleSubmitReport(row) {
      const data = new FormData()
      data.append('companyId', this.companyId)
      data.append('projectId', this.checkPlanEntitie.projectId)
      data.append('entityId', this.checkPlanEntitie.id)
      data.append('file', row.file)
    },
    handleSubmitRecord(row) {
      const data = new FormData()
      data.append('companyId', this.companyId)
      data.append('projectId', this.checkPlanEntitie.projectId)
      data.append('entityId', this.checkPlanEntitie.id)
      data.append('file', row.file)
    },
    resetForm(formName) {
      this.$nextTick(() => {
        this.$refs[formName].clearValidate()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .toolbar{
    margin-bottom: 10px;
    .el-input{
      width: 240px;
    }
  }
  .pic{
    width: 60px;
    height: 60px;
    margin: 5px;
  }
  .drawer-content{
    display: flex;
    flex-direction: column;
    padding: 20px;
    height: 100%;
    overflow: auto;
    .el-form{
      flex: 1;
      height: 0;
      overflow: auto;
      .map-div{
        margin-top: 10px;
        height: 400px;
      }
    }
    .drawer-footer{
      display: flex;
      .el-button{
        flex: 1;
      }
    }
    .el-cascader,.el-select,.el-input{
      width: 100%;
    }
  }
</style>
<style>
.plan-table .el-input .el-input__inner{
  background-color: none !important;
}
</style>
