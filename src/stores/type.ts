export interface ChinaTotal {
  noInfect: number
  showLocalConfirm: number
  local_acc_confirm: number
  localWzzAdd: number
  nowSevere: number
  dead: number
  localConfirmH5: number
  confirmAdd: number
  highRiskAreaNum: number
  confirm: number
  mtime: string
  localConfirmAdd: number
  nowConfirm: number
  mRiskTime: string
  heal: number
  importedCase: number
  showlocalinfeciton: number
  noInfectH5: number
  nowLocalWzz: number
  deadAdd: number
  mediumRiskAreaNum: number
  localConfirm: number
  suspect: number
}

export interface ChinaAdd {
  localConfirmH5: number
  heal: number
  dead: number
  suspect: number
  nowSevere: number
  noInfect: number
  localConfirm: number
  noInfectH5: number
  confirm: number
  nowConfirm: number
  importedCase: number
}

export interface ShowAddSwitch {
  all: boolean
  nowConfirm: boolean
  importedCase: boolean
  noInfect: boolean
  localConfirm: boolean
  localinfeciton: boolean
  confirm: boolean
  suspect: boolean
  dead: boolean
  heal: boolean
  nowSevere: boolean
}

export interface Today {
  confirm: number
  isUpdated: boolean
}

export interface Total {
  dead: number
  heal: number
  mediumRiskAreaNum: number
  mtime: string
  confirm: number
  continueDayZeroLocalConfirmAdd: number
  nowConfirm: number
  showRate: boolean
  provinceLocalConfirm: number
  highRiskAreaNum: number
  adcode: string
  showHeal: boolean
  wzz: number
  continueDayZeroLocalConfirm: number
}

export interface Today {
  confirm: number
  confirmCuts: number
  isUpdated: boolean
  tip: string
  wzz_add: number
  local_confirm_add: number
  abroad_confirm_add: number
  dead_add: number
}

export interface Total {
  nowConfirm: number
  confirm: number
  mediumRiskAreaNum: number
  continueDayZeroLocalConfirmAdd: number
  mtime: string
  adcode: string
  dead: number
  wzz: number
  provinceLocalConfirm: number
  showRate: boolean
  heal: number
  showHeal: boolean
  continueDayZeroConfirm: number
  highRiskAreaNum: number
  continueDayZeroConfirmAdd: number
}

export interface Today {
  confirm: number
  confirmCuts: number
  isUpdated: boolean
  wzz_add: string
  local_confirm_add: number
}

export interface Total {
  confirm: number
  nowConfirm: number
  heal: number
  mediumRiskAreaNum: number
  adcode: string
  wzz: number
  provinceLocalConfirm: number
  continueDayZeroLocalConfirmAdd: number
  continueDayZeroLocalConfirm: number
  dead: number
  showRate: boolean
  showHeal: boolean
  highRiskAreaNum: number
  mtime: string
}

export interface Children {
  name: string
  adcode: string
  date: string
  today: Today
  total: Total
}

export interface Children {
  name: string
  adcode: string
  date: string
  today: Today
  total: Total
  children: Children[]
}

export interface AreaTree {
  name: string
  today: Today
  total: Total
  children: Children[]
}

export interface Diseaseh5Shelf {
  chinaTotal: ChinaTotal
  chinaAdd: ChinaAdd
  isShowAdd: boolean
  showAddSwitch: ShowAddSwitch
  areaTree: AreaTree[]
  lastUpdateTime: string
}

export interface RootObject {
  diseaseh5Shelf: Diseaseh5Shelf
}
