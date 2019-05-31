import 'reflect-metadata';
import { getFromContainer, MetadataStorage } from 'class-validator'; // tslint:disable-line
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { Express } from 'express';
import { createExpressServer, getMetadataArgsStorage, RoutingControllersOptions } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import morgan from 'morgan';
import { JobMetricsController } from './controllers/metrics';

const routingControllersOptions: RoutingControllersOptions = {
  controllers: [JobMetricsController],
  routePrefix: '/api',
  classTransformer: true,
};
const app: Express = createExpressServer(routingControllersOptions);
app.use(morgan('dev'));

// Parse class-validator classes into JSON Schema:
const metadatas = (getFromContainer(MetadataStorage) as any).validationMetadatas;
const schemas = validationMetadatasToSchemas(metadatas, {
  refPointerPrefix: '#/components/schemas/',
});

// Parse routing-controllers classes into OpenAPI spec:
const storage = getMetadataArgsStorage();
const spec = routingControllersToSpec(storage, routingControllersOptions, {
  components: {
    schemas,
  },
  info: {
    description: 'Generated with `routing-controllers-openapi`',
    title: 'Metrics API',
    version: '1.0.0',
  },
});

// Render spec on root:
app.get('/', (req, res) => {
  res.json(spec);
});

const port = process.env.PORT || 4001;
app.listen(port, () => {
  console.log(`Metrics service listening on port ${port}`); // tslint:disable-line
});
