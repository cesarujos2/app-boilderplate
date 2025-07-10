export interface Actions {
    id: number;
    name: string;
    description: string;
}

export interface ScheduledTask {
    id: number | null;
    time: Date;
    actionId: number;
    days: number[];
    isActive: boolean;
}

export interface ExecutionCount {
    executionNumber: number;
    scheduledTaskId: number;
    count: number;
    startDate: Date;
    endDate: Date;
}

export interface ResolutionDocument {
  id: number;
  expedientNumber: null;
  documentType: string;
  documentNumber: string;
  documentDate: string;
  alfrescoId: string;
  isSynchronized: boolean;
}