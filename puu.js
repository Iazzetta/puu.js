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
  #template
  #puuengine
  #changes

  constructor($root){
    this.#root = $root
    this.#context = {}
    this.#template = ""
    this.#puuengine = new PuuEngine();
    this.#changes = true;
    this.#render()
  }

  #render() {
    setInterval(() => {
      if (this.#changes) {
        this.#root.innerHTML = this.#engine()
        this.#changes = false;
      }
    }, 1000 / 60)
  }

  #engine() {
    let renderedTemplate = this.#template.trim();
    const vars = this.#puuengine.get(renderedTemplate, "{{", "}}");
    for (let x in vars) {
      renderedTemplate = this.#puuengine.replaceAll(
        renderedTemplate,
        `{{${vars[x]}}}`,
        vars[x].includes('f:') ?
          this.#context[`${vars[x].replace('f:', '')}`]() :
          this.#context[vars[x]]
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

  template(template) {
    this.#template = template
    this.#changes = true;
  }
}
