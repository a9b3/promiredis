# Promiredis

[![Build Status](https://travis-ci.org/esayemm/promiredis.svg?branch=master)](https://travis-ci.org/esayemm/promiredis)

Promise wrapped node redis client.

## Installation

```sh
npm i --save promiredis
```

## Usage

```javascript
import promiredis from 'promiredis'

async function main() {
	promiredis.initialize({ port: 6379, host: 'localhost', namespace: 'FOO' })
	
	// will write into key 'FOO/foo'
	await promiredis.set('foo', { name: 'foo' })
	
	// will get from key 'FOO/foo'
	const res = await promiredis.get('foo')
}

try {
	main()
} catch (e) { ... }
```