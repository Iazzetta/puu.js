class PuuEngine {
  constructor() {
    this.results = [];
    this.string = "";
  }

  variator(sub1, sub2) {
    if(this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return false;
    var SP = this.string.indexOf(sub1)+sub1.length;
    var string1 = this.string.substr(0,SP);
    var string2 = this.string.substr(SP);
    var TP = string1.length + string2.indexOf(sub2);
    return this.string.substring(SP,TP);
  }

  take(sub1, sub2) {
      if(this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return false;
      var removal = sub1+this.variator(sub1,sub2)+sub2;
      this.string = this.string.replace(removal,"");
  }

  allResults(sub1, sub2) {
      if(this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return;
      var result = this.variator(sub1,sub2);
      this.results.push(result);
      this.take(sub1,sub2);
      if(this.string.indexOf(sub1) > -1 && this.string.indexOf(sub2) > -1)
          this.allResults(sub1,sub2);
  }

  replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
  }

  get(string, sub1, sub2) {
      this.results = [];
      this.string = string;
      this.allResults(sub1,sub2);
      return this.results;
  }
}

class Puu {
  #root
  #context
  #watch
  #template
  #puuengine
  #changes

  constructor($root){
    this.#root = $root
    this.#context = {}
    this.#watch = {}
    this.#template = ""
    this.#puuengine = new PuuEngine();
    this.#changes = true;
    this.#render()
  }

  #render() {
    setInterval(() => {
      if (this.#changes) {
        this.#root.innerHTML = this.#engine()
        this.#createEvents()
        this.#changes = false;
      }
    }, 1000 / 60)
  }

  #createEvents() {
    for (let ctx in this.#watch) {
      this.#root.querySelector(`[puu-watch="${ctx}"]`).addEventListener('input', (ev) => {
        this.#watch[ctx] = ev.currentTarget.value;
        this.#changes = true;
        setTimeout(() => {
          this.#root.querySelector(`[puu-watch="${ctx}"]`).focus();
          this.#root.querySelector(`[puu-watch="${ctx}"]`).selectionStart = this.#root.querySelector(`[puu-watch="${ctx}"]`).selectionEnd = 10000;
        }, 15);
      })
    }
  }
  #engine() {
    let renderedTemplate = this.#template.trim();
    const vars = this.#puuengine.get(renderedTemplate, "{{", "}}");
    for (let x in vars) {
      let response = '';
      if (vars[x].includes('f:')) {
        response = this.#context[`${vars[x].replace('f:', '')}`]()
      }
      else if (vars[x].includes('w:')) {
        response = this.#watch[`${vars[x].replace('w:', '')}`]
      } else {
        response = this.#context[vars[x]]
      }

      renderedTemplate = this.#puuengine.replaceAll(
        renderedTemplate,
        `{{${vars[x]}}}`,
        response
      )
    }
    return renderedTemplate;
  }

  context(context) {
    Object.assign(this.#context, context)
    this.#changes = true
  }

  ctx(context = false) {
    if (!context) return this.#context;
    if (context.includes('f:')) {
      return this.#context[`${context.replace('f:', '')}`]();
    }
    return this.#context[context]
  }

  watch(context = false) {
    Object.assign(this.#watch, context)
    this.#changes = true
  }

  w(context = false) {
    if (!context) return this.#watch;
    return this.#watch[context]
  }

  template(template) {
    this.#template = template
    this.#changes = true;
  }
}
