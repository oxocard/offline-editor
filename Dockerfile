# SPDX-FileCopyrightText: Copyright (c) 2025, Oxon AG
#
# SPDX-License-Identifier: BSD-3-Clause

FROM node:23-alpine3.20

WORKDIR /app
COPY . /app

RUN npm install
RUN npm run build

EXPOSE 1777

CMD ["npm", "start", "--", "--host", "0.0.0.0"]
