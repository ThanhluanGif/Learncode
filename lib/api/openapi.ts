const jsonContent = (schema: Record<string, unknown>) => ({
  "application/json": { schema },
});

const schemaRef = (name: string) => ({ $ref: `#/components/schemas/${name}` });

const errorResponses = {
  "400": { description: "Dữ liệu không hợp lệ", content: jsonContent(schemaRef("ApiError")) },
  "401": { description: "Cần identity nền tảng", content: jsonContent(schemaRef("ApiError")) },
  "404": { description: "Không tìm thấy tài nguyên thuộc người học", content: jsonContent(schemaRef("ApiError")) },
  "500": { description: "Lỗi kho dữ liệu", content: jsonContent(schemaRef("ApiError")) },
};

const identityHeader = {
  name: "oai-authenticated-user-email",
  in: "header",
  required: true,
  schema: { type: "string", format: "email" },
  description: "Header identity do OpenAI Sites chuyển tiếp; client không tự chọn learner id.",
};

export const openApiDocument = {
  openapi: "3.1.0",
  info: {
    title: "Tin học trẻ LAB API",
    version: "v1",
    description: "Hợp đồng runtime cho kho đề có nguồn gốc và chu trình học thuộc người dùng.",
  },
  paths: {
    "/api/me": {
      get: {
        summary: "Đọc hoặc tạo hồ sơ người học hiện tại",
        parameters: [identityHeader],
        responses: {
          "200": { description: "Hồ sơ hiện tại", content: jsonContent({ type: "object", required: ["learner"], properties: { learner: schemaRef("Learner") } }) },
          "401": errorResponses["401"],
          "500": errorResponses["500"],
        },
      },
    },
    "/api/library": {
      get: {
        summary: "Tìm và lọc kho đề",
        parameters: [
          identityHeader,
          { name: "q", in: "query", schema: { type: "string", maxLength: 100 } },
          { name: "year", in: "query", schema: { type: "integer" } },
          { name: "division", in: "query", schema: { type: "string", enum: ["A", "B", "C1", "C2"] } },
          { name: "round", in: "query", schema: { type: "string", maxLength: 60 } },
          { name: "topic", in: "query", schema: { type: "string", maxLength: 60 } },
          { name: "sourceStatus", in: "query", schema: { type: "string", enum: ["official", "community", "legacy", "unverified"] } },
          { name: "examId", in: "query", schema: { type: "integer" } },
        ],
        responses: {
          "200": { description: "Kết quả thư viện", content: jsonContent(schemaRef("LibraryResponse")) },
          ...errorResponses,
        },
      },
    },
    "/api/learning": {
      get: {
        summary: "Đọc lịch sử học của người hiện tại",
        parameters: [identityHeader, { name: "limit", in: "query", schema: { type: "integer", minimum: 1, maximum: 100 } }],
        responses: {
          "200": { description: "Lịch sử học", content: jsonContent(schemaRef("LearningOverview")) },
          "401": errorResponses["401"],
          "500": errorResponses["500"],
        },
      },
      post: {
        summary: "Ghi một hành động trong chu trình học",
        parameters: [identityHeader],
        requestBody: { required: true, content: jsonContent(schemaRef("LearningCommand")) },
        responses: {
          "200": { description: "Cập nhật thành công", content: jsonContent(schemaRef("LearningCommandResult")) },
          "201": { description: "Tạo thành công", content: jsonContent(schemaRef("LearningCommandResult")) },
          ...errorResponses,
        },
      },
    },
    "/api/progress": {
      get: {
        summary: "Đọc tiến độ có giải thích",
        parameters: [identityHeader],
        responses: {
          "200": { description: "Tiến độ", content: jsonContent(schemaRef("ProgressResponse")) },
          "401": errorResponses["401"],
          "500": errorResponses["500"],
        },
      },
    },
    "/api/pilot-feedback": {
      get: {
        summary: "Đọc thống kê pilot ẩn danh",
        parameters: [identityHeader],
        responses: {
          "200": { description: "Thống kê pilot", content: jsonContent({ type: "object", required: ["summary"], properties: { summary: schemaRef("PilotFeedbackSummary") } }) },
          "401": errorResponses["401"],
          "500": errorResponses["500"],
        },
      },
      post: {
        summary: "Gửi đánh giá pilot tối thiểu",
        parameters: [identityHeader],
        requestBody: { required: true, content: jsonContent(schemaRef("PilotFeedbackInput")) },
        responses: {
          "201": { description: "Biên nhận đánh giá", content: jsonContent({ type: "object", required: ["feedback"], properties: { feedback: schemaRef("PilotFeedbackReceipt") } }) },
          "400": errorResponses["400"],
          "401": errorResponses["401"],
          "500": errorResponses["500"],
        },
      },
    },
    "/api/health": {
      get: {
        summary: "Kiểm tra runtime và D1",
        responses: {
          "200": { description: "Sẵn sàng", content: jsonContent(schemaRef("HealthResponse")) },
          "503": { description: "Kho dữ liệu chưa sẵn sàng", content: jsonContent(schemaRef("HealthResponse")) },
        },
      },
    },
    "/openapi.json": {
      get: {
        summary: "Đọc OpenAPI 3.1",
        responses: { "200": { description: "Tài liệu máy đọc", content: jsonContent({ type: "object" }) } },
      },
    },
    "/docs": {
      get: {
        summary: "Đọc tài liệu API cho con người",
        responses: { "200": { description: "Trang tài liệu", content: { "text/html": { schema: { type: "string" } } } } },
      },
    },
  },
  components: {
    schemas: {
      ApiError: {
        type: "object",
        required: ["error"],
        properties: {
          error: {
            type: "object",
            required: ["code", "message"],
            properties: {
              code: { type: "string", enum: ["AUTH_REQUIRED", "VALIDATION_ERROR", "NOT_FOUND", "DATABASE_ERROR"] },
              message: { type: "string" },
              issues: { type: "array", items: { type: "object", required: ["path", "message"], properties: { path: { type: "string" }, message: { type: "string" } } } },
            },
          },
        },
      },
      Learner: {
        type: "object",
        required: ["id", "displayName", "division", "schoolLevel", "xp", "createdAt"],
        properties: {
          id: { type: "integer" }, displayName: { type: "string" },
          division: { type: "string", enum: ["A", "B", "C1", "C2"] },
          schoolLevel: { type: "string", enum: ["Tiểu học", "THCS", "THPT"] },
          xp: { type: "integer" }, createdAt: { type: "string" },
        },
      },
      ContentSource: { type: "object", additionalProperties: true },
      ExamPaper: { type: "object", additionalProperties: true },
      Problem: { type: "object", additionalProperties: true },
      StudySession: { type: "object", additionalProperties: true },
      ProblemAttempt: { type: "object", additionalProperties: true },
      LearningReflection: { type: "object", additionalProperties: true },
      LearningCommand: {
        oneOf: ["start_session", "set_status", "record_attempt", "save_reflection"].map((action) => ({
          type: "object",
          required: ["action"],
          properties: { action: { const: action } },
          additionalProperties: true,
        })),
        discriminator: { propertyName: "action" },
      },
      LearningCommandResult: { type: "object", required: ["action"], properties: { action: { type: "string" } }, additionalProperties: true },
      LearningOverview: {
        type: "object", required: ["sessions", "attempts", "reflections"],
        properties: {
          sessions: { type: "array", items: schemaRef("StudySession") },
          attempts: { type: "array", items: schemaRef("ProblemAttempt") },
          reflections: { type: "array", items: schemaRef("LearningReflection") },
        },
      },
      LibraryResponse: {
        type: "object", required: ["sources", "exams", "problems", "recentSessions", "stats", "appliedFilters"],
        properties: {
          sources: { type: "array", items: schemaRef("ContentSource") },
          exams: { type: "array", items: schemaRef("ExamPaper") },
          problems: { type: "array", items: schemaRef("Problem") },
          recentSessions: { type: "array", items: schemaRef("StudySession") },
          stats: { type: "object" }, appliedFilters: { type: "object" },
        },
      },
      ProgressResponse: { type: "object", additionalProperties: true },
      PilotFeedbackInput: { type: "object", required: ["role", "rating", "completedCycle", "minutesSpent"], additionalProperties: false },
      PilotFeedbackReceipt: { type: "object", additionalProperties: true },
      PilotFeedbackSummary: { type: "object", additionalProperties: true },
      HealthResponse: {
        type: "object", required: ["status", "database", "version"],
        properties: {
          status: { type: "string", enum: ["ok", "degraded"] },
          database: { type: "string", enum: ["ok", "error"] },
          version: { const: "v1" },
        },
      },
    },
  },
} as const;

export const documentedInterfaces = [
  ["GET", "/api/me", "token"],
  ["GET", "/api/library", "token"],
  ["GET", "/api/learning", "token"],
  ["POST", "/api/learning", "token"],
  ["GET", "/api/progress", "token"],
  ["GET", "/api/pilot-feedback", "token"],
  ["POST", "/api/pilot-feedback", "token"],
  ["GET", "/api/health", "public"],
  ["GET", "/openapi.json", "public"],
  ["GET", "/docs", "public"],
] as const;
