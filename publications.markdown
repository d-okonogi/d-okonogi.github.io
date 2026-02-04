---
layout: default
title: Publications
lang: en
permalink: /publications.html
---

<h1>Publications</h1>

{% assign target_author = "D. Okonogi" %}
{% assign sorted_refs = site.data.references | sort: "sort_date" | reverse %}

<div class="pub-section">
  <h2>Journal Articles</h2>
  <div class="pub-list">
    {% for item in sorted_refs %}
      {% if item.type == "article-journal" %}
        <div class="pub-item">
          <span class="pub-title">{{ item.title }}</span>
          <div class="pub-meta">
            <span class="pub-authors">
              {% for author in item.author %}
                {% capture name %}{{ author.given | slice: 0 }}. {{ author.family }}{% endcapture %}
                <span class="{% if name == target_author %}my-name{% endif %}">
                  {{ name }}
                </span>{% unless forloop.last %}, {% endunless %}
              {% endfor %}
            </span>
            <span class="pub-journal"><i>{{ item['container-title'] }}</i></span>
            {% if item.volume %}, Vol. {{ item.volume }}{% endif %}
            {% if item.issue %}, No. {{ item.issue }}{% endif %}
            {% if item.page %}, pp. {{ item.page }}{% endif %}
            <span class="pub-year">({% if item.issued.date-parts[0][1] %}{% assign m = item.issued.date-parts[0][1] %}{% case m %}{% when 1 %}Jan.{% when 2 %}Feb.{% when 3 %}Mar.{% when 4 %}Apr.{% when 5 %}May{% when 6 %}Jun.{% when 7 %}Jul.{% when 8 %}Aug.{% when 9 %}Sep.{% when 10 %}Oct.{% when 11 %}Nov.{% when 12 %}Dec.{% endcase %} {% endif %}{{ item.issued.date-parts[0][0] }})</span>
          </div>
          {% if item.DOI %}
          <a href="https://doi.org/{{ item.DOI }}" class="btn-read-paper" target="_blank" rel="noopener">Read Paper</a>
          {% endif %}
        </div>
      {% endif %}
    {% endfor %}
  </div>
</div>

<div class="pub-section">
  <h2>Conference Papers</h2>
  <div class="pub-list">
    {% for item in sorted_refs %}
      {% if item.type == "paper-conference" %}
        <div class="pub-item">
          <span class="pub-title">{{ item.title }}</span>
          <div class="pub-meta">
            <span class="pub-authors">
              {% for author in item.author %}
                {% capture name %}{{ author.given | slice: 0 }}. {{ author.family }}{% endcapture %}
                <span class="{% if name == target_author %}my-name{% endif %}">
                  {{ name }}
                </span>{% unless forloop.last %}, {% endunless %}
              {% endfor %}
            </span>
            <span class="pub-journal"><i>{{ item['container-title'] }}</i></span>
            {% if item.page %}, pp. {{ item.page }}{% endif %}
            <span class="pub-year">({% if item.issued.date-parts[0][1] %}{% assign m = item.issued.date-parts[0][1] %}{% case m %}{% when 1 %}Jan.{% when 2 %}Feb.{% when 3 %}Mar.{% when 4 %}Apr.{% when 5 %}May{% when 6 %}Jun.{% when 7 %}Jul.{% when 8 %}Aug.{% when 9 %}Sep.{% when 10 %}Oct.{% when 11 %}Nov.{% when 12 %}Dec.{% endcase %} {% endif %}{{ item.issued.date-parts[0][0] }})</span>
          </div>
          {% if item.DOI %}
          <a href="https://doi.org/{{ item.DOI }}" class="btn-read-paper" target="_blank" rel="noopener">Read Paper</a>
          {% endif %}
        </div>
      {% endif %}
    {% endfor %}
  </div>
</div>
