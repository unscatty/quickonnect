import fetch from 'node-fetch'
import path from 'node:path'
import fs from 'node:fs'
import { mkdirp } from 'mkdirp'

import { getIntrospectionQuery } from 'graphql/utilities/getIntrospectionQuery'
import { buildClientSchema } from 'graphql/utilities/buildClientSchema'
import { printSchema } from 'graphql/utilities/printSchema'

interface Options {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  headers?: { [key: string]: string }
  json?: boolean
}

/**
 *
 * Fetch remote schema and turn it into string
 *
 * @param endpoint
 * @param options
 */
export async function getRemoteSchema(
  endpoint: string,
  options: Options
): Promise<string> {
  const { data, errors } = (await fetch(endpoint, {
    method: options.method,
    headers: options.headers,
    body: JSON.stringify({ query: getIntrospectionQuery() }),
  }).then((res) => res.json())) as any

  if (errors) {
    throw JSON.stringify(errors, null, 2)
  }

  if (options.json) {
    return JSON.stringify(data, null, 2)
  } else {
    const schema = buildClientSchema(data)
    return printSchema(schema)
  }
}

/**
 *
 * Prints schema to file.
 *
 * @param dist
 * @param schema
 */
export function printSchemaToFile(dist: string, schema: string): string {
  const output = path.resolve(process.cwd(), dist)
  const outputDir = path.dirname(output)

  if (!fs.existsSync(outputDir)) {
    mkdirp.sync(outputDir)
  }
  fs.writeFileSync(output, schema)

  return output
}
