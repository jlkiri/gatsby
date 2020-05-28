import { readFile } from "fs-extra"

jest.mock(`fs-extra`, () => {
  return {
    readFile: jest.fn(() => `contents`),
  }
})
import glob from "glob"

import { pagesReducer as reducer } from "../reducers/pages"
import { actions } from "../actions"
import { IPageInput } from "../types"

afterEach(() => {
  ;(readFile as jest.Mock).mockClear()
})

Date.now = jest.fn(
  () =>
    // const diff = new Date().getTime() - start
    1482363367071 // + diff
)

glob.sync = jest.fn()

describe(`Add pages`, () => {
  it(`allows you to add pages`, () => {
    const action = actions.createPage(
      {
        path: `/hi/`,
        component: `/whatever/index.js`,
      },
      { id: `test`, name: `test` }
    )
    const state = reducer(undefined, action as any)
    expect(action).toMatchSnapshot()
    expect(state).toMatchSnapshot()
  })

  it(`Fails if path is missing`, () => {
    const action = actions.createPage(
      {
        component: `/path/to/file1.js`,
      } as any,
      { id: `test`, name: `test` }
    )
    expect(action).toMatchSnapshot()
  })

  it(`Fails if component path is missing`, () => {
    const action = actions.createPage(
      {
        path: `/whatever/`,
      } as any,
      { id: `test`, name: `test` }
    )
    expect(action).toMatchSnapshot()
  })

  it(`Fails if the component path isn't absolute`, () => {
    const action = actions.createPage(
      {
        path: `/whatever/`,
        component: `cheese.js`,
      },
      { id: `test`, name: `test` }
    )
    expect(action).toMatchSnapshot()
  })

  it(`Fails if use a reserved field in the context object`, () => {
    const action = actions.createPage(
      {
        component: `/path/to/file1.js`,
        path: `/yo/`,
        context: {
          path: `/yo/`,
          matchPath: `/pizz*`,
        },
      },
      { id: `test`, name: `test` }
    )
    expect(action).toMatchSnapshot()
  })

  it(`adds an initial forward slash if the user doesn't`, () => {
    const action = actions.createPage(
      {
        path: `hi/`,
        component: `/whatever/index.js`,
      },
      { id: `test`, name: `test` }
    )
    const state = reducer(undefined, action as any)
    expect(Array.from(state.values())[0].path).toEqual(`/hi/`)
  })

  it(`allows you to add pages with context`, () => {
    const action = actions.createPage(
      {
        path: `/hi/`,
        component: `/whatever/index.js`,
        context: {
          id: 123,
        },
      },
      { id: `test`, name: `test` }
    )
    const state = reducer(undefined, action as any)
    expect(action).toMatchSnapshot()
    expect(state).toMatchSnapshot()
  })

  it(`allows you to add pages with matchPath`, () => {
    const action = actions.createPage(
      {
        path: `/hi/`,
        component: `/whatever/index.js`,
        matchPath: `/hi-from-somewhere-else/`,
      },
      { id: `test`, name: `test` }
    )
    const state = reducer(undefined, action as any)
    expect(action).toMatchSnapshot()
    expect(state).toMatchSnapshot()
  })

  it(`allows you to add multiple pages`, () => {
    const action = actions.createPage(
      {
        path: `/hi/`,
        component: `/whatever/index.js`,
      },
      { id: `test`, name: `test` }
    )
    const action2 = actions.createPage(
      {
        path: `/hi/pizza/`,
        component: `/whatever/index.js`,
      },
      { id: `test`, name: `test` }
    )
    let state = reducer(undefined, action as any)
    state = reducer(state, action2 as any)
    expect(state).toMatchSnapshot()
    expect(state.size).toEqual(2)
  })

  it(`allows you to update existing pages (based on path)`, () => {
    const action = actions.createPage(
      {
        path: `/hi/`,
        component: `/whatever/index.js`,
      },
      { id: `test`, name: `test` }
    )

    // Change the component
    const action2 = actions.createPage(
      {
        path: `/hi/`,
        component: `/whatever2/index.js`,
      },
      { id: `test`, name: `test` }
    )

    let state = reducer(undefined, action as any)
    state = reducer(state, action2 as any)
    expect(state).toMatchSnapshot()
    expect(state.size).toEqual(1)
  })

  it(`allows you to delete paths`, () => {
    const action = actions.createPage(
      {
        path: `/hi/`,
        component: `/whatever/index.js`,
      },
      { id: `test`, name: `test` }
    )
    const action2 = actions.deletePage({ path: `/hi/` })

    let state = reducer(undefined, action as any)
    state = reducer(state, action2)
    expect(state).toMatchSnapshot()
    expect(state.size).toEqual(0)
  })
})
